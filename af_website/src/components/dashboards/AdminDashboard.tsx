import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, BookOpen, Settings, BarChart3, LogOut, Sparkles } from "lucide-react";
import CourseManager from "@/components/course/CourseManager";
import UserManager from "@/components/admin/UserManager";
import SystemStats from "@/components/admin/SystemStats";
import CourseViewer from "@/components/course/CourseViewer";
import { useCourseStore } from "@/stores/courseStore";
import PaymentProcessing from "@/components/admin/PaymentProcessing";


interface AdminDashboardProps {
  onLogout: () => void;
}

const AdminDashboard = ({ onLogout }: AdminDashboardProps) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [previewCourseId, setPreviewCourseId] = useState<string | null>(null);
  const courses = useCourseStore((state) => state.courses);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      {/* Enhanced Header */}
      <header className="bg-white/80 backdrop-blur-lg shadow-lg border-b border-gray-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center group">
              <div className="relative">
                <BookOpen className="h-10 w-10 text-red-600 mr-4 transition-all duration-500 group-hover:scale-110 group-hover:rotate-12" />
                <Sparkles className="absolute -top-1 -right-1 h-4 w-4 text-yellow-500 animate-pulse" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent">
                  Admin Dashboard
                </h1>
                <p className="text-sm text-gray-600 mt-1">Manage your learning platform with precision</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              onClick={onLogout} 
              className="flex items-center gap-2 hover:scale-105 transition-all duration-300 border-gray-300 hover:border-red-400 hover:text-red-600"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-4 bg-white/80 backdrop-blur-sm border border-gray-200/50 shadow-lg rounded-xl p-2">
            <TabsTrigger 
              value="overview" 
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-500 data-[state=active]:to-red-600 data-[state=active]:text-white transition-all duration-300"
            >
              <BarChart3 className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger 
              value="courses" 
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-blue-600 data-[state=active]:text-white transition-all duration-300"
            >
              <BookOpen className="h-4 w-4" />
              Courses
            </TabsTrigger>
            <TabsTrigger 
              value="users" 
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-green-600 data-[state=active]:text-white transition-all duration-300"
            >
              <Users className="h-4 w-4" />
              Users
            </TabsTrigger>

            <TabsTrigger 
              value="settings" 
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-purple-600 data-[state=active]:text-white transition-all duration-300"
            >
              <Settings className="h-4 w-4" />
              Payment
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="animate-fade-in">
            <SystemStats />
          </TabsContent>

          <TabsContent value="courses" className="animate-fade-in">
            {previewCourseId ? (
              <CourseViewer
                course={courses.find((c) => c.id === previewCourseId)!}
                onBack={() => setPreviewCourseId(null)}
                onLogout={onLogout}
              />
            ) : (
              <CourseManager role="admin" onPreview={setPreviewCourseId} />
            )}
          </TabsContent>

          <TabsContent value="users" className="animate-fade-in">
            <UserManager />
          </TabsContent>
          <TabsContent value="settings" className="animate-fade-in">
            <Card className="bg-white/80 backdrop-blur-sm border-gray-200/50 shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-gray-900">Payments</CardTitle>
                <CardDescription>Manage payments and generate invoices for students</CardDescription>
              </CardHeader>
              <CardContent className="py-8">
                <div className="text-center">
                  {/* PaymentProcessing component goes here */}
                  <PaymentProcessing />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
