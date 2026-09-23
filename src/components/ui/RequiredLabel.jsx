/** A form label followed by the red asterisk that marks a required field. */
export default function RequiredLabel({ children }) {
  return (
    <>
      {children} <span className="text-red-500">*</span>
    </>
  );
}
