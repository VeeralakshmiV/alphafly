
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Users, BarChart3, LogOut, GraduationCap, Sparkles } from "lucide-react";
import CourseManager from "@/components/course/CourseManager";

interface StaffDashboardProps {
  onLogout: () => void;
}

const StaffDashboard = ({ onLogout }: StaffDashboardProps) => {
  const [activeTab, setActiveTab] = useState("courses");

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      {/* Enhanced Header */}
      <header className="bg-white/80 backdrop-blur-lg shadow-lg border-b border-gray-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center group">
              <div className="relative">
                <GraduationCap className="h-10 w-10 text-blue-600 mr-4 transition-all duration-500 group-hover:scale-110 group-hover:rotate-12" />
                <Sparkles className="absolute -top-1 -right-1 h-4 w-4 text-yellow-500 animate-pulse" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                  Staff Dashboard
                </h1>
                <p className="text-sm text-gray-600 mt-1">Create and manage your courses with ease</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              onClick={onLogout} 
              className="flex items-center gap-2 hover:scale-105 transition-all duration-300 border-gray-300 hover:border-blue-400 hover:text-blue-600"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-3 bg-white/80 backdrop-blur-sm border border-gray-200/50 shadow-lg rounded-xl p-2">
            <TabsTrigger 
              value="courses" 
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-blue-600 data-[state=active]:text-white transition-all duration-300"
            >
              <BookOpen className="h-4 w-4" />
              My Courses
            </TabsTrigger>
            <TabsTrigger 
              value="students" 
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-green-600 data-[state=active]:text-white transition-all duration-300"
            >
              <Users className="h-4 w-4" />
              Students
            </TabsTrigger>
            <TabsTrigger 
              value="analytics" 
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-purple-600 data-[state=active]:text-white transition-all duration-300"
            >
              <BarChart3 className="h-4 w-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="courses" className="animate-fade-in">
            <CourseManager role="staff" />
          </TabsContent>

          <TabsContent value="students" className="animate-fade-in">
            <Card className="bg-white/80 backdrop-blur-sm border-gray-200/50 shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-gray-900">Student Management</CardTitle>
                <CardDescription>View and manage enrolled students</CardDescription>
              </CardHeader>
              <CardContent className="py-16">
                <div className="text-center">
                  <Users className="h-16 w-16 text-gray-400 mx-auto mb-4 animate-pulse" />
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Student Management</h3>
                  <p className="text-gray-600">Student management panel coming soon...</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="animate-fade-in">
            <Card className="bg-white/80 backdrop-blur-sm border-gray-200/50 shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-gray-900">Course Analytics</CardTitle>
                <CardDescription>Track student progress and course performance</CardDescription>
              </CardHeader>
              <CardContent className="py-16">
                <div className="text-center">
                  <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-4 animate-pulse" />
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Analytics Dashboard</h3>
                  <p className="text-gray-600">Analytics dashboard coming soon...</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default StaffDashboard;
