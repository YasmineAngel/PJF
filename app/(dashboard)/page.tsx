"use client";

import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BookOpen, Users, FileText, CheckCircle } from "lucide-react";
import { useEffect, useState } from "react";

const Card = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={`rounded-2xl shadow-md p-4 bg-white hover:shadow-xl transition-all ${className}`}>
    {children}
  </div>
);
const CardHeader = ({ children }: { children: React.ReactNode }) => (
  <div className="mb-2">{children}</div>
);
const CardTitle = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <h3 className={`font-bold text-lg ${className}`}>{children}</h3>
);
const CardDescription = ({ children }: { children: React.ReactNode }) => (
  <p className="text-sm text-gray-500">{children}</p>
);
const CardContent = ({ children }: { children: React.ReactNode }) => (
  <div className="mt-2">{children}</div>
);

export default function DashboardPage() {
  const { user } = useUser();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#edf2ff] to-[#dbeafe] text-center">
        <h1 className="text-5xl font-extrabold text-blue-700 mb-4 tracking-wide">WELEARN</h1>
        <p className="text-lg text-gray-600 animate-pulse">Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f4f5ff] to-white p-6">
      <header className="mb-10 text-center">
        <h1 className="text-4xl font-bold text-blue-800">WELEARN</h1>
        <p className="text-gray-600 text-lg mt-1">Welcome back, {user?.firstName || "Student"}!</p>
      </header>

      {/* Dashboard Cards Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Dashboard</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <DashboardCard 
            icon={<BookOpen className="w-6 h-6" />}
            title="My Courses"
            description="View and track your courses"
            href="/root"
            color="bg-indigo-100 text-indigo-600"
          />
        {  <DashboardCard 
            icon={<FileText className="w-6 h-6" />}
            title="Tasks"
            description="create a to do list"
            href="/todo"
            color="bg-pink-100 text-pink-600"
          /> }
          <DashboardCard 
            icon={<Users className="w-6 h-6" />}
            title="Community"
            description="Join discussions"
            href="/community"
            color="bg-yellow-100 text-yellow-600"
          />
           <DashboardCard 
            icon={<CheckCircle className="w-6 h-6" />}
            title="quiz results"
            description="check your quiz results"
            href="/quizResults"
            color="bg-green-100 text-green-600"
          />
          
        </div>
      </section>
    </div>
  );
}

type DashboardCardProps = {
  icon: React.ReactNode;
  title: string;
  count?: string;
  description: string;
  href: string;
  color: string;
};

function DashboardCard({ icon, title, count, description, href, color }: DashboardCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-xl ${color}`}>
            {icon}
          </div>
          <div>
            <CardTitle>{title}</CardTitle>
            {count && <div className="text-2xl font-bold text-gray-800">{count}</div>}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <CardDescription>{description}</CardDescription>
        <Button className="mt-4 w-full" asChild>
          <Link href={href}>Go</Link>
        </Button>
      </CardContent>
    </Card>
  );
}


