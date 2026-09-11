type Props = {
  label: string;
  value: string;
  fontSize?: string;
}

const PatientField = ({ label, value, fontSize }: Props) => {
  return (
    <p style={{ fontSize }}>
      <span>{label}: </span>
      <span>{value}</span>
    </p>
  );
};

export default PatientField;
