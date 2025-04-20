"use client";

import { NextPage, NextPageContext } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface ErrorProps {
  statusCode: number | undefined;
  message?: string;
}

const ErrorPage: NextPage<ErrorProps> = ({ statusCode, message }) => {
  const router = useRouter();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    // Auto-redirect to home page after countdown
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      router.push("/");
    }
  }, [countdown, router]);

  const getErrorMessage = (): string => {
    switch (statusCode) {
      case 404:
        return message || "The page you are looking for does not exist";
      case 500:
        return message || "Internal server error";
      default:
        return message || "An unexpected error occurred";
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <Head>
        <title>{`Error ${statusCode || ""}  | Your App`}</title>
        <meta
          name="description"
          content={`Error ${statusCode || ""} page`}
        />
      </Head>

      <main className="flex flex-col items-center justify-center w-full max-w-md p-6 mx-auto text-center">
        <h1 className="text-9xl font-bold text-gray-800">
          {statusCode || "?"}
        </h1>
        <div className="w-full h-1 my-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full" />
        <h2 className="mb-4 text-xl font-bold text-gray-700">
          {getErrorMessage()}
        </h2>
        <p className="mb-8 text-gray-600">
          Redirecting to home page in {countdown} seconds...
        </p>
        <div className="flex space-x-4">
          <button
            onClick={() => router.back()}
            className="px-4 py-2 text-sm font-medium text-white bg-gray-700 rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
            Go Back
          </button>
          <Link
            href="/"
            legacyBehavior>
            <a className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              Go Home
            </a>
          </Link>
        </div>
      </main>
    </div>
  );
};

ErrorPage.getInitialProps = ({ res, err }: NextPageContext): ErrorProps => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default ErrorPage;
