type ErrorMessageProps = {
  messages: string[];
};

function ErrorMessage({ messages }: ErrorMessageProps) {
  if (messages.length === 0) {
    return null;
  }

  if (messages.length === 1) {
    return <span>{messages[0]}</span>;
  }

  return (
    <ul>
      {messages.map((message) => (
        <li key={message}>{message}</li>
      ))}
    </ul>
  );
}

export default ErrorMessage;
