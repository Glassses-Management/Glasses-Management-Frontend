import Card from "@/components/ui/Card";

function About() {
  return (
    <section>
      <h1 className="mb-4 text-3xl font-bold">About</h1>
      <p className="text-gray-600">
        Client Registry & Patients is a vision care management system that helps
        optometry clinics track customers, appointments, prescriptions, and orders in
        one place.
      </p>

      <Card title="What we do">
        <ul className="list-disc space-y-1 pl-5">
          <li>Keep a complete registry of clients and their contact information.</li>
          <li>Schedule and manage eye exams and follow-up appointments.</li>
          <li>Store prescriptions so lens and frame orders are always accurate.</li>
          <li>Track orders from request to pickup or delivery.</li>
        </ul>
      </Card>

      <Card title="Who it&apos;s for">
        <p>
          Built for optometrists, opticians, and clinic front-desk staff who want to
          spend less time on paperwork and more time caring for their patients.
        </p>
      </Card>
    </section>
  );
}

export default About;