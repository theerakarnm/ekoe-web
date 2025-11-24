import {
  DatePicker,
  DateOfBirthPicker,
  DatePickerWithInput,
  DateTimePicker,
  NaturalLanguagePicker,
} from "~/components/ui/date-picker"

export function meta() {
  return [
    { title: "Date Picker Demo" },
    { name: "description", content: "Date picker component examples" },
  ]
}

export default function DatePickerDemo() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Date Picker Components</h1>
          <p className="text-muted-foreground mt-2 text-lg">
            A collection of date picker variants built with Radix UI and react-day-picker.
          </p>
        </div>

        <div className="space-y-12">
          {/* Basic Date Picker */}
          <section className="space-y-4">
            <div>
              <h2 className="text-2xl font-semibold">Basic Date Picker</h2>
              <p className="text-muted-foreground mt-1">
                A simple date picker with a calendar icon trigger.
              </p>
            </div>
            <div className="border-border bg-card rounded-lg border p-8">
              <DatePicker />
            </div>
          </section>

          {/* Date of Birth Picker */}
          <section className="space-y-4">
            <div>
              <h2 className="text-2xl font-semibold">Date of Birth Picker</h2>
              <p className="text-muted-foreground mt-1">
                Date picker with year and month dropdown selectors for easier navigation.
              </p>
            </div>
            <div className="border-border bg-card rounded-lg border p-8">
              <DateOfBirthPicker />
            </div>
          </section>

          {/* Date Picker with Input */}
          <section className="space-y-4">
            <div>
              <h2 className="text-2xl font-semibold">Date Picker with Input</h2>
              <p className="text-muted-foreground mt-1">
                Combines manual date input with calendar picker. Type a date or select from the calendar.
              </p>
            </div>
            <div className="border-border bg-card rounded-lg border p-8">
              <DatePickerWithInput />
            </div>
          </section>

          {/* Date and Time Picker */}
          <section className="space-y-4">
            <div>
              <h2 className="text-2xl font-semibold">Date and Time Picker</h2>
              <p className="text-muted-foreground mt-1">
                Select both date and time with separate inputs.
              </p>
            </div>
            <div className="border-border bg-card rounded-lg border p-8">
              <DateTimePicker />
            </div>
          </section>

          {/* Natural Language Picker */}
          <section className="space-y-4">
            <div>
              <h2 className="text-2xl font-semibold">Natural Language Picker</h2>
              <p className="text-muted-foreground mt-1">
                Type natural language dates like "tomorrow", "next week", or "in 2 days".
              </p>
            </div>
            <div className="border-border bg-card rounded-lg border p-8">
              <NaturalLanguagePicker />
            </div>
          </section>
        </div>

        <div className="border-border bg-muted/50 mt-12 rounded-lg border p-6">
          <h3 className="font-semibold">Usage</h3>
          <p className="text-muted-foreground mt-2 text-sm">
            Import any of these components from{" "}
            <code className="bg-muted relative rounded px-1.5 py-0.5 font-mono text-sm">
              ~/components/ui/date-picker
            </code>{" "}
            and use them in your forms or pages.
          </p>
          <div className="bg-muted mt-4 rounded-md p-4">
            <pre className="text-sm">
              <code>{`import { DatePicker, DateOfBirthPicker } from "~/components/ui/date-picker"`}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  )
}
