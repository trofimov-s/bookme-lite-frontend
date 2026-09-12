import { cn } from 'cn';

type ErrorMessageProps = {
  messages: string[];
  classes?: string;
};

function ErrorMessage({ messages, classes }: ErrorMessageProps) {
  if (messages.length === 0) {
    return null;
  }

  return (
    <ul className={cn('flex flex-col gap-y-0.5', classes)}>
      {messages.map((message) => (
        <li className="text-sm text-destructive" key={message}>
          {message}
        </li>
      ))}
    </ul>
  );
}

export default ErrorMessage;
