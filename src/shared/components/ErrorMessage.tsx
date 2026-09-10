import { cn } from 'cn';

type ErrorMessageProps = {
  messages: string[];
  classNames: string;
};

function ErrorMessage({ messages, classNames }: ErrorMessageProps) {
  if (messages.length === 0) {
    return null;
  }

  return (
    <ul className={cn('flex flex-col gap-y-0.5', classNames)}>
      {messages.map((message) => (
        <li className="text-sm text-destructive" key={message}>
          {message}
        </li>
      ))}
    </ul>
  );
}

export default ErrorMessage;
