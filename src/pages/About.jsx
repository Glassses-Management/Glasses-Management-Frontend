import {
  Eye,
  Users,
  CalendarDays,
  ClipboardList,
  ShoppingCart,
  FileText,
  Target,
  HeartHandshake,
} from "lucide-react";

const features = [
  {
    icon: Users,
    title: "Patients",
    description:
      "Manage patient information and contact details easily.",
  },
  {
    icon: CalendarDays,
    title: "Appointments",
    description:
      "Schedule and manage eye examinations and follow-up appointments.",
  },
  {
    icon: ClipboardList,
    title: "Prescriptions",
    description:
      "Store accurate prescriptions for lenses and frames.",
  },
  {
    icon: ShoppingCart,
    title: "Orders",
    description:
      "Track orders from request to pickup or delivery.",
  },
];

function About() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero */}
      <section className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
          <div className="flex flex-col sm:flex-row items-center gap-5">
            <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-blue-50 text-blue-600 shrink-0">
              <Eye className="w-7 h-7" />
            </div>
            <div className="text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
                About Our Vision Care System
              </h1>
              <p className="mt-2 text-slate-600 max-w-2xl leading-relaxed">
                A vision care management system designed to help optical clinics
                manage patients, appointments, prescriptions, and orders
                efficiently.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 space-y-8 lg:space-y-12">
        {/* About the System */}
        <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 sm:p-8">
          <div className="flex items-start gap-4">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-50 text-blue-600 shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                About the System
              </h2>
              <p className="mt-2 text-slate-600 leading-relaxed">
                Client Registry &amp; Patients is a vision care management system
                that helps optometry clinics manage patient information,
                appointments, prescriptions, and orders in one place.
              </p>
            </div>
          </div>
        </section>

        {/* What We Do */}
        <section>
          <h2 className="text-lg font-semibold text-slate-900 mb-4">
            What We Do
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="group bg-white rounded-xl border border-slate-200 shadow-sm p-5 min-h-[190px] transition duration-200 hover:shadow-md"
              >
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-50 text-blue-600 mb-3 group-hover:bg-blue-100 transition duration-200">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-slate-900">{title}</h3>
                <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Who We Serve */}
        <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="p-6 sm:p-8 flex flex-col justify-center">
              <h2 className="text-lg font-semibold text-slate-900">
                Who We Serve
              </h2>
              <p className="mt-3 text-slate-600 leading-relaxed">
                Our system is designed for optometrists, opticians, and clinic
                staff who want to spend less time on paperwork and more time
                caring for their patients.
              </p>
            </div>
            <div className="flex items-center justify-center bg-slate-50 p-6 sm:p-8 border-t md:border-t-0 md:border-l border-slate-200">
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-50 text-blue-600">
                  <HeartHandshake className="w-8 h-8" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-slate-700 font-medium">
                    <Users className="w-4 h-4 text-blue-500" />
                    Optometrists
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-700 font-medium">
                    <Users className="w-4 h-4 text-blue-500" />
                    Opticians
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-700 font-medium">
                    <Users className="w-4 h-4 text-blue-500" />
                    Clinic Staff
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Our Goal */}
        <section className="bg-blue-600 rounded-xl p-6 sm:p-8 text-white">
          <div className="flex flex-col sm:flex-row items-start gap-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-white/15 shrink-0">
              <Target className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Our Goal</h2>
              <p className="mt-2 text-blue-100 leading-relaxed max-w-3xl">
                To make vision care management simpler, faster, and more
                organized by bringing patient records, appointments,
                prescriptions, and orders into one easy-to-use system.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default About;
