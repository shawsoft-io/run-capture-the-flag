'use client'
import React, { useState, ChangeEvent, FormEvent } from "react";

// Define the shape of the form data
interface FormData {
  name: string;
  email: string;
  issueType: string;
  message: string;
}

const SupportForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    issueType: "General Inquiry",
    message: "",
  });

  const [successMessage, setSuccessMessage] = useState<string>("");
  const [submitted, setSubmitted] = useState<boolean>(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // Replace this with your actual submission logic (e.g., API call)
    console.log("Form Submitted", formData);
    setSubmitted(true);
    setSuccessMessage("We've got your message! We'll be intouch soon :)");
    setFormData({
      name: "",
      email: "",
      issueType: "General Inquiry",
      message: "",
    });
  };

  return (
    <>
    
    <div className="absolute w-full h-40 bg-hotpink z-10"></div>
<div className="flex min-h-full flex-1 flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 bg-hotpink mt-40 z-20">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <img
            alt="Your Company"
            src="/run-3d.png"
            className="mx-auto h-[260px] sm:h-18 w-auto"
          />
          <h2 className="mt-10 text-center text-4xl font-bold tracking-tight text-white">
          Help is on the way dear!
          </h2>
        </div>
    
    <div className=" mt-10 p-6 bg-white shadow-lg rounded-lg">

      {successMessage && (
        <p className="text-hotpink font-bold text-center mb-4">{successMessage}</p>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-lg font-bold text-gray-700">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            disabled={submitted}
            required
            className="mt-1 block w-full p-4 border-2 border-black  shadow-sm focus:ring-blue-500 focus:border-blue-500 text-lg"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-lg font-bold text-gray-700">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            disabled={submitted}
            required
            className="mt-1 block w-full p-4 border-2 border-black shadow-sm focus:ring-blue-500 focus:border-blue-500 text-lg"
          />
        </div>
        <div>
          <label htmlFor="issueType" className="block text-lg font-bold text-gray-700">
            Issue Type
          </label>
          <select
            id="issueType"
            name="issueType"
            value={formData.issueType}
            onChange={handleChange}
            disabled={submitted}
            className="mt-1 block w-full p-4 border-2 border-black shadow-sm focus:ring-blue-500 focus:border-blue-500 text-lg"
          >
            <option>General Inquiry</option>
            <option>Bug Report</option>
            <option>Feature Request</option>
            <option>Other</option>
          </select>
        </div>
        <div>
          <label htmlFor="message" className="block text-lg font-bold text-gray-700">
            Message
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            disabled={submitted}
            rows={4}
            required
            className="mt-1 block w-full p-4 border-2 border-black shadow-sm focus:ring-hotpink  text-lg"
          ></textarea>
        </div>
        <div className="text-center">
          <button
            type="submit"
            disabled={submitted}
            className="w-full py-4 px-6 bg-white text-black border-black border-2 text-lg font-semibold shadow-lg hover:bg-gray-200 "
          >
            Submit
          </button>
        </div>
      </form>
    </div>
    </div>

    </>
  );
};

export default SupportForm;