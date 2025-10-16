"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// Simplified test schema
const testSchema = z.object({
  firstName: z.string().min(1, "Required").min(2, "Too short"),
  emergencyPhone: z
    .string()
    .min(1, "Required")
    .refine(
      (val) => {
        const digitsOnly = val.replace(/[\s\-\+\(\)]/g, "");
        return digitsOnly.length >= 10 && /^[0-9]+$/.test(digitsOnly);
      },
      { message: "Invalid phone" }
    ),
});

type TestData = z.infer<typeof testSchema>;

export default function DebugTest() {
  const form = useForm<TestData>({
    defaultValues: {
      firstName: "",
      emergencyPhone: "",
    },
    resolver: zodResolver(testSchema),
    mode: "onSubmit",
  });

  const onSubmit = (data: TestData) => {
    alert("Success: " + JSON.stringify(data));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    form.handleSubmit(onSubmit, (errors) => {
    })(e);
  };

  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Debug Test Form</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-2">First Name</label>
          <input
            {...form.register("firstName")}
            className="border p-2 w-full rounded"
            placeholder="Enter name"
          />
          {form.formState.errors.firstName && (
            <p className="text-red-500 text-sm mt-1">
              {form.formState.errors.firstName.message}
            </p>
          )}
        </div>

        <div>
          <label className="block mb-2">Phone</label>
          <input
            {...form.register("emergencyPhone")}
            type="tel"
            className="border p-2 w-full rounded"
            placeholder="9999999999"
          />
          {form.formState.errors.emergencyPhone && (
            <p className="text-red-500 text-sm mt-1">
              {form.formState.errors.emergencyPhone.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Submit
        </button>
      </form>

      <div className="mt-4 p-4 bg-gray-100 rounded text-xs">
        <p>Current Values: {JSON.stringify(form.getValues())}</p>
        <p>Errors: {JSON.stringify(form.formState.errors)}</p>
      </div>
    </div>
  );
}
