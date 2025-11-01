/**
 * Component to show empty states (no results, no data, etc.)
 */
const EmptyData = ({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) => {
  return (
    <div className="phrase-grid-empty">
      {icon}
      <h3 className="gray-color">{title}</h3>
      <p className="gray-color">{description}</p>
    </div>
  );
};

export default EmptyData;
