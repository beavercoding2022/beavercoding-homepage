export default function Button(
  props: React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  >,
) {
  return (
    <button
      className="bg-btn-background hover:bg-btn-background-hover p-2 rounded-full m-2"
      {...props}
    >
      {props.children}
    </button>
  );
}
