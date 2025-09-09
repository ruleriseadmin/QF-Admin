"use client";
import { useEffect, useRef, useState } from "react";
import { getMessaging, onMessage, Unsubscribe } from "firebase/messaging";
import { fetchToken, messaging } from './firebase';
import { useRouter } from "next/navigation";
import { decryptToken } from "@/utils/protect";
import axios from "axios";
import { customAlphabet } from "nanoid";

// Generate a unique device ID
const generateDeviceId = () => {
  const nanoid = customAlphabet("0123456789abcdefghijklmnopqrstuvwxyz", 10);
  return nanoid();
};

// Retrieve or generate a unique device ID
const getDeviceId = () => {
  let deviceId = localStorage.getItem("device_id");
  if (!deviceId) {
    deviceId = generateDeviceId();
    localStorage.setItem("device_id", deviceId);
    
  } else {
    
  }
  return deviceId;
};

// Function to send the token to the backend
async function sendTokenToServer(token: string, deviceId: string) {
  const decryptedToken = await decryptToken();
  if (!decryptedToken) {
    console.error("Error decrypting token");
    return;
  }
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_LENDING_SERVICE_URL}/auth/set-fcm`,
      { token, device_id:deviceId },
      {
        headers: {
          Authorization: `Bearer ${decryptedToken}`,
          "x-api-key": `${process.env.NEXT_PUBLIC_LENDING_SERVICE_API_KEY}`,
        },
      }
    );
    console.log("Token sent successfully", response.data);
  } catch (error) {
    console.error("Error sending token to server", error);
  }
}

// Function to check permission and get the FCM token
async function getNotificationPermissionAndToken() {
  if (!("Notification" in window)) {
    console.info("This browser does not support desktop notifications");
    return null;
  }

  if (Notification.permission === "granted") {
    return await fetchToken(); // Retrieve the token if permission is granted
  }

  if (Notification.permission !== "denied") {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      return await fetchToken(); // Retrieve the token if permission is granted after request
    }
  }

  console.log("Notification permission not granted.");
  return null;
}

const useFcmToken = () => {
  const router = useRouter();
  const [notificationPermissionStatus, setNotificationPermissionStatus] =
    useState<NotificationPermission | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [payload, setPayload] = useState<any>(null); // State to store the payload
  const retryLoadToken = useRef(0);
  const isLoading = useRef(false);

  // Load the token when the component mounts
  const loadToken = async () => {
    if (isLoading.current) return;

    isLoading.current = true;
    const fetchedToken = await getNotificationPermissionAndToken();

    if (Notification.permission === "denied") {
      setNotificationPermissionStatus("denied");
      console.info("Push Notifications issue - permission denied");
      isLoading.current = false;
      return;
    }

    if (!fetchedToken) {
      if (retryLoadToken.current >= 3) {
        alert("Unable to load token, refresh the browser");
        console.info(
          "Push Notifications issue - unable to load token after 3 retries"
        );
        isLoading.current = false;
        return;
      }

      retryLoadToken.current += 1;
      console.error("Error retrieving token. Retrying...");
      isLoading.current = false;
      await loadToken();
      return;
    }

    const deviceId = getDeviceId(); // Get the persisted or newly generated device ID

    // Check if the token has changed
    const savedToken = localStorage.getItem("fcm_token");
    if (savedToken !== fetchedToken) {
      console.log("New token detected. Updating server...");
      localStorage.setItem("fcm_token", fetchedToken); // Update localStorage
      await sendTokenToServer(fetchedToken, deviceId); // Send the new token and device ID to the backend
    } else {
      console.log("Token is unchanged. No server update needed.");
    }

    setNotificationPermissionStatus(Notification.permission);
    setToken(fetchedToken);
    isLoading.current = false;
  };

  useEffect(() => {
    if ("Notification" in window) {
      loadToken(); // Load the token when component mounts
    }
  }, []);

  // Set up listener for foreground notifications
  useEffect(() => {
    let unsubscribe: Unsubscribe | null = null;

    const setupListener = async () => {
      if (!token) return;

      console.log(`onMessage registered with token ${token}`);

      const m = await messaging();
      if (!m) return;

      unsubscribe = onMessage(m, (payload: any) => {
        if (Notification.permission !== "granted") return;

        console.log("Foreground push notification received:", payload);
       setPayload(payload);

        const link = payload?.data?.click_action;

        const notification = new Notification(
          payload.notification?.title || "New message",
          {
            body: payload.notification?.body || "This is a new message",
            data: payload.data?.url,
            icon: "/images/icon.png",
          }
        );
        console.log("Notification created:", notification);

        notification.onclick = (event) => {
          event.preventDefault();
          const notificationLink = (event.target as Notification)?.data;
          console.log("Notification clicked:", notificationLink);
          if (notificationLink) {
            router.push(notificationLink);
          }
        };
      });
    };

    setupListener();

    // Cleanup on unmount or token change
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [token, router]);

  return { token, notificationPermissionStatus, payload };
};

export default useFcmToken;
