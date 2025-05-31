import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  BuildingIcon,
  FileTextIcon,
  HomeIcon,
  SearchIcon,
  UserIcon,
} from "lucide-react";
import ChatbotWidget from "@/polymet/components/chatbot-widget";

export default function GovernmentServicePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BuildingIcon className="h-6 w-6 text-blue-700 dark:text-blue-400" />

            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              California Government Services
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <Input
                placeholder="Search services..."
                className="pl-10 w-[250px] bg-slate-50 dark:bg-slate-800"
              />
            </div>
            <Button variant="outline">Sign In</Button>
          </div>
        </div>
        <nav className="mt-6">
          <ul className="flex gap-6 border-b border-slate-200 dark:border-slate-700">
            {["Home", "Services", "Forms", "Locations", "Contact"].map(
              (item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="inline-block border-b-2 border-transparent pb-2 text-slate-600 hover:border-blue-600 hover:text-blue-700 dark:text-slate-300 dark:hover:border-blue-500 dark:hover:text-blue-400"
                  >
                    {item}
                  </a>
                </li>
              )
            )}
          </ul>
        </nav>
      </header>

      <main>
        <section className="mb-12">
          <div className="rounded-lg bg-gradient-to-r from-blue-600 to-blue-800 p-8 text-white">
            <h2 className="mb-2 text-3xl font-bold">
              Welcome to California Government Services
            </h2>
            <p className="mb-6 max-w-2xl text-blue-100">
              Access state services, apply for benefits, renew licenses, and
              find important information for California residents.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button className="bg-white text-blue-700 hover:bg-blue-50">
                Get Started
              </Button>
              <Button
                variant="outline"
                className="border-white text-white hover:bg-blue-700"
              >
                Learn More
              </Button>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="mb-6 text-2xl font-semibold text-slate-900 dark:text-white">
            Popular Services
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Driver's License Renewal",
                description:
                  "Renew your California driver's license online or schedule an appointment.",
                icon: UserIcon,
              },
              {
                title: "Vehicle Registration",
                description:
                  "Register a vehicle, renew registration, or report a change of address.",
                icon: FileTextIcon,
              },
              {
                title: "Property Tax Payments",
                description:
                  "Pay property taxes, check payment status, or request tax information.",
                icon: HomeIcon,
              },
            ].map((service, index) => (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center gap-4">
                  <div className="rounded-full bg-blue-100 p-2 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                    <service.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle>{service.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm text-slate-600 dark:text-slate-300">
                    {service.description}
                  </CardDescription>
                  <Button
                    variant="link"
                    className="mt-2 p-0 text-blue-600 dark:text-blue-400"
                  >
                    Access Service →
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="mb-6 text-2xl font-semibold text-slate-900 dark:text-white">
            New Resident Information
          </h2>
          <Tabs defaultValue="dmv" className="w-full">
            <TabsList className="mb-4 grid w-full grid-cols-3">
              <TabsTrigger value="dmv">DMV Services</TabsTrigger>
              <TabsTrigger value="voting">Voter Registration</TabsTrigger>
              <TabsTrigger value="benefits">Benefits & Assistance</TabsTrigger>
            </TabsList>
            <TabsContent
              value="dmv"
              className="rounded-lg border border-slate-200 p-6 dark:border-slate-700"
            >
              <h3 className="mb-4 text-lg font-medium">
                Department of Motor Vehicles
              </h3>
              <p className="mb-4 text-slate-600 dark:text-slate-300">
                New residents must register their vehicles within 20 days of
                establishing residency and obtain a California driver's license
                within 10 days.
              </p>
              <ul className="mb-4 list-disc pl-5 text-slate-600 dark:text-slate-300">
                <li>Bring proof of identity and residency</li>
                <li>
                  Complete a Driver License or Identification Card Application
                </li>
                <li>Pay the application fee</li>
                <li>Pass a vision exam</li>
                <li>Have your photo taken</li>
              </ul>
              <Button>Schedule DMV Appointment</Button>
            </TabsContent>
            <TabsContent
              value="voting"
              className="rounded-lg border border-slate-200 p-6 dark:border-slate-700"
            >
              <h3 className="mb-4 text-lg font-medium">Register to Vote</h3>
              <p className="mb-4 text-slate-600 dark:text-slate-300">
                You can register to vote online, by mail, or in person at your
                county elections office, the DMV, or other government offices.
              </p>
              <p className="mb-4 text-slate-600 dark:text-slate-300">
                To register to vote in California you must be:
              </p>
              <ul className="mb-4 list-disc pl-5 text-slate-600 dark:text-slate-300">
                <li>A United States citizen</li>
                <li>A resident of California</li>
                <li>18 years old or older on Election Day</li>
                <li>Not currently in state or federal prison</li>
                <li>Not found mentally incompetent by a court</li>
              </ul>
              <Button>Register to Vote Online</Button>
            </TabsContent>
            <TabsContent
              value="benefits"
              className="rounded-lg border border-slate-200 p-6 dark:border-slate-700"
            >
              <h3 className="mb-4 text-lg font-medium">
                Benefits & Assistance Programs
              </h3>
              <p className="mb-4 text-slate-600 dark:text-slate-300">
                California offers various assistance programs for eligible
                residents, including:
              </p>
              <ul className="mb-4 list-disc pl-5 text-slate-600 dark:text-slate-300">
                <li>CalFresh (food assistance)</li>
                <li>Medi-Cal (health insurance)</li>
                <li>CalWORKs (cash aid and services)</li>
                <li>California Earned Income Tax Credit (CalEITC)</li>
                <li>Housing assistance programs</li>
              </ul>
              <Button>Check Eligibility</Button>
            </TabsContent>
          </Tabs>
        </section>
      </main>

      <footer className="mt-16 border-t border-slate-200 py-8 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
        <p>
          © {new Date().getFullYear()} State of California. All rights
          reserved.
        </p>
        <div className="mt-2 flex justify-center gap-4">
          <a href="#" className="hover:text-blue-600 dark:hover:text-blue-400">
            Privacy Policy
          </a>
          <a href="#" className="hover:text-blue-600 dark:hover:text-blue-400">
            Accessibility
          </a>
          <a href="#" className="hover:text-blue-600 dark:hover:text-blue-400">
            Contact
          </a>
        </div>
      </footer>

      <ChatbotWidget />
    </div>
  );
}
