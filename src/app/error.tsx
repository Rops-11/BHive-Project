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
  const [effectiveHomePath, setEffectiveHomePath] = useState<string>("/");

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const referrerUrl = new URL(document.referrer);
        if (referrerUrl.pathname.startsWith("/admin")) {
          setEffectiveHomePath("/admin");
        } else {
          setEffectiveHomePath("/");
        }
      } catch (error) {
        console.warn(
          "Could not parse document.referrer, defaulting home path to '/'",
          error
        );
        setEffectiveHomePath("/");
      }
    }
  }, []);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      if (effectiveHomePath) {
        router.push(effectiveHomePath);
      }
    }
  }, [countdown, router, effectiveHomePath]);

  const getErrorMessage = (): string => {
    switch (statusCode) {
      case 404:
        return message || "The page you are looking for does not exist.";
      case 500:
        return message || "Oops! Something went wrong on our end.";
      default:
        return message || "An unexpected error occurred.";
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-4">
      <Head>
        <title>{`Error ${statusCode || "Page"} | Your App`}</title>
        <meta
          name="description"
          content={`Error ${statusCode || ""}: ${getErrorMessage()}`}
        />
      </Head>

      <main className="flex flex-col items-center justify-center w-full max-w-lg p-6 sm:p-8 mx-auto text-center bg-white dark:bg-gray-800 shadow-xl rounded-lg">
        <div className="text-6xl sm:text-7xl font-bold text-red-500 dark:text-red-400 mb-4">
          {statusCode === 404 ? "🤔" : "🔥"}
        </div>
        <h1 className="text-5xl sm:text-6xl font-extrabold text-gray-800 dark:text-gray-100">
          {statusCode || "Error"}
        </h1>
        <div className="w-24 h-1.5 my-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full" />
        <h2 className="mb-4 text-xl sm:text-2xl font-semibold text-gray-700 dark:text-gray-300">
          {getErrorMessage()}
        </h2>
        <p className="mb-8 text-gray-600 dark:text-gray-400">
          {countdown > 0
            ? `Redirecting to ${
                effectiveHomePath === "/admin"
                  ? "the admin dashboard"
                  : "the home page"
              } in ${countdown} seconds...`
            : `Redirecting now...`}
        </p>
        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 w-full">
          <button
            onClick={() => router.back()}
            className="w-full px-6 py-3 text-base font-medium text-white bg-gray-600 dark:bg-gray-700 rounded-md hover:bg-gray-700 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 dark:focus:ring-offset-gray-800 transition-colors duration-150">
            Go Back
          </button>
          <Link
            href={effectiveHomePath}
            className="w-full inline-block px-6 py-3 text-base font-medium text-white bg-blue-600 dark:bg-blue-500 rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800 transition-colors duration-150">
            {effectiveHomePath === "/admin" ? "Go to Admin" : "Go Home"}
          </Link>
        </div>
      </main>
      <footer className="mt-8 text-sm text-gray-500 dark:text-gray-400">
        If the issue persists, please contact support.
      </footer>
    </div>
  );
};

ErrorPage.getInitialProps = ({ res, err }: NextPageContext): ErrorProps => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;

  return { statusCode };
};

export default ErrorPage;
