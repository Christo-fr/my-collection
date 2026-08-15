interface FormErrorProps {
  message?: string;
}

export default function FormError({ message }: FormErrorProps) {
  if (!message) return null;

  return (
    <p className="text-sm text-red-400 bg-red-500/10 p-3 rounded-lg border border-red-500/20 text-center">
      {message}
    </p>
  );
}
