const RADIAN = Math.PI / 180;

interface PieLabelProps {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  percent: number;
  value: number;
  index: number;
  growth?: boolean;
}

const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, value, index,growth=false }: PieLabelProps) => {
  console.log("Growth in label:", growth);
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text 
    x={x} 
    y={y} 
    fill="#FFFFFF" 
    style={{ fontSize: '16px',fontWeight: 'bold' }} 
    textAnchor={x > cx ? 'start' : 'end'}
     dominantBaseline="central">
       {!growth ? `${(percent * 100).toFixed(0)}%` : value}
    </text>
  );
};
export default renderCustomizedLabel;