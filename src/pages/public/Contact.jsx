import { useState } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

function Contact() {
  const [submitted, setSubmitted] = useState(false);

  // preventDefault stops the browser's default full-page reload on form submit
  function handleSubmit(event) {
    event.preventDefault();
    setSubmitted(true);
  }

  return (
    <section>
      <h1 className="mb-4 text-3xl font-bold dark:text-neutral-50">Contact</h1>
      <Card title="Send a message">
        {submitted ? (
          <p className="dark:text-neutral-300">Thanks! We&apos;ll get back to you soon.</p>
        ) : (
          <form className="flex flex-col gap-1.5" onSubmit={handleSubmit}>
            <label htmlFor="email" className="mt-2 text-sm text-gray-600 dark:text-neutral-400">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              className="rounded-md border border-gray-300 bg-white p-2 text-gray-900 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
            />

            <label htmlFor="message" className="mt-2 text-sm text-gray-600 dark:text-neutral-400">
              Message
            </label>
            <textarea
              id="message"
              rows={4}
              required
              className="rounded-md border border-gray-300 bg-white p-2 text-gray-900 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
            />

            <Button type="submit" variant="primary" className="mt-3 self-start">
              Send
            </Button>
          </form>
        )}
      </Card>
    </section>
  );
}

export default Contact;
