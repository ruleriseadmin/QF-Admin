import * as XLSX from "xlsx";
export const exportToExcel = (data: any[], title: string = "Sheet1") => {
  if (!data || data.length === 0) {
    console.error("No data provided for export.");
    return;
  }

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, title);

  XLSX.writeFile(workbook, `${title}.xlsx`);
};

export const flattenObject = (obj: any, parentKey = '', result: any = {}) => {
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const newKey = parentKey ? `${parentKey}_${key}` : key;

      if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
        // Recursively flatten nested objects
        flattenObject(obj[key], newKey, result);
      } else if (Array.isArray(obj[key]) && obj[key].length > 0) {
        // Flatten the first item of an array (e.g., loan_schedules_0_due_date)
        obj[key].forEach((item, index) => {
          if (typeof item === 'object' && item !== null) {
            flattenObject(item, `${newKey}_${index}`, result);
          } else {
            result[`${newKey}_${index}`] = item;
          }
        });
      } else {
        // Assign non-object values
        result[newKey] = obj[key];
      }
    }
  }
  return result;
};



//format currency to add a comma
export const formatCurrency = (amount: number | null) => {
  if (amount === null) return '₦ 0';
  return '₦ ' + amount?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};
export const formatValue = (amount: number | null) => {
  if (amount === null) return '0';
  return  amount?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export const formatDate = (dateString: string): string => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const formatter = new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
  return formatter.format(date);
};

export const formatTime = (dateString: string): string => {
  if (!dateString) return '';
  const [hourStr, minute] = dateString.split(':');
  const hour = Number(hourStr);

  const period = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 === 0 ? 12 : hour % 12;

  return `${hour12}:${minute} ${period}`;
};

export function formatMonthYear(value: string): string {
  if (!value) return '';
  const [year, month] = value.split('-');
  const date = new Date(parseInt(year), parseInt(month) - 1);
  return new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short' }).format(date);
}


export function calculateDaysBetween(dateString: string): number | string {
  const inputDate = new Date(dateString);
  const today = new Date();

  // Calculate the difference in time (in milliseconds)
  const timeDifference = today.getTime() - inputDate.getTime();

  // Convert the time difference to days (1 day = 24 * 60 * 60 * 1000 ms)
  const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

  return daysDifference < 0 ? 0 : daysDifference;
}

export function calculateClosedDaysBetween(expiry: string, update:string): number | string {
  const inputDate = new Date(expiry);
  const today = new Date(update);

  // Calculate the difference in time (in milliseconds)
  const timeDifference = today.getTime() - inputDate.getTime();

  // Convert the time difference to days (1 day = 24 * 60 * 60 * 1000 ms)
  const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
  

  return daysDifference < 0 ? 0 : daysDifference;
}

export const saveToExcel = async (response:any) => {
  try {
    if (response && response.data) {
      // Get the binary data (Excel file)
      const blob = response.data;

      // Create an object URL for the blob
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);

      // Set the file name for the download (you can change the name if needed)
      const fileName = window.location.pathname.split('/').pop();
      link.download =  `${fileName}.xlsx`;

      // Trigger the download by simulating a click
      link.click();

      // Optionally, revoke the URL to free memory
      URL.revokeObjectURL(link.href);
    } else {
      console.error('Error fetching Excel file');
    }
  } catch (error) {
    console.error('Download failed', error);
  }
};

