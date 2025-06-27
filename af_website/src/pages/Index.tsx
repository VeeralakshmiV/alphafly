import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { Users, BookOpen, GraduationCap, Settings, ChevronRight, Sparkles, Menu, X, Play, Instagram, Star, Award, Clock, CheckCircle, ChevronDown, Shield, UserCheck } from "lucide-react";
import AdminDashboard from "@/components/dashboards/AdminDashboard";
import StaffDashboard from "@/components/dashboards/StaffDashboard";
import StudentDashboard from "@/components/dashboards/StudentDashboard";
import TestimonialsSection from "@/components/TestimonialsSection";

type UserRole = 'admin' | 'staff' | 'student' | null;

const Index = () => {
  const [currentRole, setCurrentRole] = useState<UserRole>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (currentRole) {
    switch (currentRole) {
      case 'admin':
        return <AdminDashboard onLogout={() => setCurrentRole(null)} />;
      case 'staff':
        return <StaffDashboard onLogout={() => setCurrentRole(null)} />;
      case 'student':
        return <StudentDashboard onLogout={() => setCurrentRole(null)} />;
    }
  }

  const heroVideos = [
    {
      id: 1,
      title: "Programming Fundamentals",
      filename: "videos/alphavideo1.mp4",
      thumbnail: "/thumbnails/a11.jpg",
      instagramUrl: "https://www.instagram.com/reel/xyz1/"
    },
    {
      id: 2,
      title: "Web Development Mastery",
      filename: "videos/alphavideo2.mp4",
      thumbnail: "/thumbnails/a9.jpg",
      instagramUrl: "https://www.instagram.com/reel/xyz2/"
    },
    {
      id: 3,
      title: "Data Science Excellence",
      filename: "videos/alphavideo3.mp4",
      thumbnail: "/thumbnails/a10.jpg",
      instagramUrl: "https://www.instagram.com/reel/xyz3/"
    }
  ];

  const features = [
    {
      icon: BookOpen,
      title: "Expert-Led Courses",
      description: "Learn from industry professionals with real-world experience"
    },
    {
      icon: Award,
      title: "Certified Programs",
      description: "Get industry-recognized certifications upon completion"
    },
    {
      icon: Clock,
      title: "Flexible Learning",
      description: "Study at your own pace with 24/7 access to materials"
    },
    {
      icon: Users,
      title: "Community Support",
      description: "Join a vibrant community of learners and mentors"
    }
  ];

  const stats = [
    { number: "5000+", label: "Students Trained" },
    { number: "50+", label: "Expert Instructors" },
    { number: "100+", label: "Courses Available" },
    { number: "95%", label: "Success Rate" }
  ];

  const courses = [
    {
      title: "Full Stack Web Development",
      description: "Master modern web technologies including React, Node.js, and databases",
      duration: "6 months",
      level: "Beginner to Advanced",
      price: "₹25,000",
      rating: 4.9,
      students: 1200
    },
    {
      title: "Data Science & Analytics",
      description: "Learn Python, Machine Learning, and data visualization techniques",
      duration: "8 months",
      level: "Intermediate",
      price: "₹30,000",
      rating: 4.8,
      students: 800
    },
    {
      title: "Digital Marketing",
      description: "Complete digital marketing including SEO, SEM, and social media",
      duration: "4 months",
      level: "Beginner",
      price: "₹15,000",
      rating: 4.7,
      students: 950
    },
    {
      title: "Mobile App Development",
      description: "Build native and cross-platform mobile applications",
      duration: "7 months",
      level: "Intermediate",
      price: "₹28,000",
      rating: 4.8,
      students: 650
    },
    {
      title: "UI/UX Design",
      description: "Create stunning user interfaces and experiences",
      duration: "5 months",
      level: "Beginner",
      price: "₹20,000",
      rating: 4.6,
      students: 750
    }
  ];

  const handlePlayVideo = (videoId: number) => {
    const videoElem = document.getElementById(`video-player-${videoId}`) as HTMLVideoElement;
    if (videoElem) {
      videoElem.play();
    }
  };

  const handlePauseVideo = (videoId: number) => {
    const videoElem = document.getElementById(`video-player-${videoId}`) as HTMLVideoElement;
    if (videoElem) {
      videoElem.pause();
    }
  };

  const handleInstagramClick = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white overflow-x-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-blue-900/20 to-purple-900/20"></div>
        <div className="absolute inset-0 opacity-30">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-blue-400 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>
      </div>

      {/* Enhanced Navigation */}
      <nav className="fixed top-0 w-full bg-gray-900/95 backdrop-blur-xl border-b border-gray-800/50 z-50 shadow-2xl shadow-blue-500/10">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            {/* Enhanced Logo */}
            <div className="flex items-center space-x-4 animate-fade-in group">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-purple-600 to-blue-700 rounded-xl flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg shadow-blue-500/30">
                  <BookOpen className="h-7 w-7 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-pulse"></div>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-blue-600 bg-clip-text text-transparent">
                  AlphaFly
                </span>
                <span className="text-xs text-gray-400 font-medium tracking-wider">Computer Education</span>
              </div>
            </div>

            {/* Enhanced Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              <div className="flex items-center space-x-8">
                {['Home', 'Courses', 'Testimonials', 'Contact'].map((item) => (
                  <a
                    key={item}
                    href={`#${item.toLowerCase()}`}
                    className="relative text-gray-300 hover:text-white transition-all duration-300 group px-3 py-2 rounded-lg hover:bg-gray-800/50"
                  >
                    <span className="relative z-10 font-medium">{item}</span>
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 transition-all duration-300 group-hover:w-full rounded-full"></span>
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 rounded-lg transition-all duration-300"></div>
                  </a>
                ))}
              </div>
              
              {/* Enhanced Login Portals */}
              <div className="flex items-center space-x-4">
                {/* Admin/Staff Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="group border-blue-500/50 text-white-400 hover:bg-blue-500/20 hover:border-blue-400 hover:scale-105 transition-all duration-300 bg-gray-800/50 backdrop-blur-sm shadow-lg shadow-blue-500/20"
                    >
                      <Shield className="h-4 w-4 mr-2 group-hover:rotate-12 transition-transform duration-300" />
                      Admin/Staff
                      <ChevronDown className="h-4 w-4 ml-2 group-hover:rotate-180 transition-transform duration-300" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent 
                    className="w-56 bg-gray-800/95 backdrop-blur-xl border-gray-700/50 shadow-2xl shadow-blue-500/10"
                    align="end"
                  >
                    <DropdownMenuItem 
                      onClick={() => setCurrentRole('admin')}
                      className="flex items-center space-x-3 p-3 hover:bg-blue-500/20 focus:bg-blue-500/20 cursor-pointer group"
                    >
                      <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-pink-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                        <Settings className="h-4 w-4 text-white" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-medium text-white">Admin Portal</span>
                        <span className="text-xs text-gray-400">Full system access</span>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-gray-700/50" />
                    <DropdownMenuItem 
                      onClick={() => setCurrentRole('staff')}
                      className="flex items-center space-x-3 p-3 hover:bg-green-500/20 focus:bg-green-500/20 cursor-pointer group"
                    >
                      <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                        <UserCheck className="h-4 w-4 text-white" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-medium text-white">Staff Portal</span>
                        <span className="text-xs text-gray-400">Course management</span>
                      </div>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Student Portal Button */}
                <Button
                  size="sm"
                  onClick={() => setCurrentRole('student')}
                  className="group bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 hover:scale-105 transition-all duration-300 shadow-lg shadow-blue-500/25 border-0"
                >
                  <GraduationCap className="h-4 w-4 mr-2 group-hover:rotate-12 transition-transform duration-300" />
                  Student Portal
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-700 opacity-0 group-hover:opacity-100 rounded-md transition-opacity duration-300"></div>
                </Button>
              </div>
            </div>

            {/* Enhanced Mobile Menu Button */}
            <div className="lg:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-gray-300 hover:text-white hover:bg-gray-800/50 p-3 rounded-lg transition-all duration-300"
              >
                {mobileMenuOpen ? 
                  <X className="h-6 w-6 rotate-90 transition-transform duration-300" /> : 
                  <Menu className="h-6 w-6 hover:rotate-90 transition-transform duration-300" />
                }
              </Button>
            </div>
          </div>

          {/* Enhanced Mobile Menu */}
          {mobileMenuOpen && (
            <div className="lg:hidden py-6 border-t border-gray-800/50 animate-fade-in bg-gray-900/50 backdrop-blur-xl rounded-b-2xl">
              <div className="flex flex-col space-y-4">
                {['Home', 'Courses', 'Testimonials', 'Contact'].map((item) => (
                  <a
                    key={item}
                    href={`#${item.toLowerCase()}`}
                    className="text-gray-300 hover:text-white transition-all duration-300 py-3 px-4 rounded-lg hover:bg-gray-800/50 border-l-4 border-transparent hover:border-blue-400"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item}
                  </a>
                ))}
                
                <div className="flex flex-col space-y-3 pt-4 border-t border-gray-800/50">
                  <div className="px-4 text-sm text-gray-400 font-medium">Access Portals</div>
                  
                  {/* Mobile Admin/Staff Options */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setCurrentRole('admin');
                      setMobileMenuOpen(false);
                    }}
                    className="justify-start border-red-500/50 text-red-400 hover:bg-red-500/20 mx-4"
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Admin Portal
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setCurrentRole('staff');
                      setMobileMenuOpen(false);
                    }}
                    className="justify-start border-green-500/50 text-green-400 hover:bg-green-500/20 mx-4"
                  >
                    <UserCheck className="h-4 w-4 mr-2" />
                    Staff Portal
                  </Button>
                  
                  <Button
                    size="sm"
                    onClick={() => {
                      setCurrentRole('student');
                      setMobileMenuOpen(false);
                    }}
                    className="justify-start bg-gradient-to-r from-blue-500 to-purple-600 mx-4"
                  >
                    <GraduationCap className="h-4 w-4 mr-2" />
                    Student Portal
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative pt-20 pb-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/10 to-gray-900"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10 pt-8">
          <div className="text-center mb-12">
             <h1 className="text-3xl md:text-5xl font-bold mb-8 animate-fade-in">
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-blue-600 bg-clip-text text-transparent">
                AlphaFly 
              </span>
              {/* <br /> */}
              <span className="text-white"> Computer Education</span>
            </h1>
            
           <p className="text-xl md:text-2lg text-gray-300 max-w-4xl mx-auto mb-4 animate-fade-in leading-relaxed">
              Unlocking Minds, Empowering Futures
            </p>
            
          </div>

          {/* Hero Videos Section */}
          <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {heroVideos.map((video, index) => (
              <Card 
                key={video.id} 
                className="group hover:shadow-2xl transition-all duration-700 border-0 bg-gray-800/50 backdrop-blur-sm hover:bg-gray-800/70 transform hover:scale-105 hover:-translate-y-2"
                style={{
                  animationDelay: `${index * 200}ms`
                }}
              >
                <CardContent className="p-0">
                  <div className="relative overflow-hidden rounded-lg flex items-center justify-center" style={{ height: '320px', width: '100%' }}>
                    <video
                      id={`video-player-${video.id}`}
                      src={`/${video.filename}`}
                      poster={video.thumbnail}
                      className="object-cover rounded-t-lg"
                      style={{ height: '100%', width: '100%', minHeight: '320px', maxHeight: '320px', minWidth: '100%', aspectRatio: '16/9' }}
                      preload="metadata"
                    >
                      Your browser does not support the video tag.
                    </video>
                    {/* Centered and always visible action buttons over the video */}
                    <div className="absolute inset-0 flex items-center justify-center z-10">
                      <div className="flex items-center space-x-3 px-4 py-2">
                        <Button
                          size="lg"
                          className="bg-blue-600/90 backdrop-blur-sm hover:bg-blue-600 border border-blue-400/30 shadow-lg shadow-blue-500/25"
                          onClick={() => handlePlayVideo(video.id)}
                        >
                          <Play className="h-5 w-5 text-white" />
                        </Button>
                        <Button
                          size="lg"
                          className="bg-red-600/90 backdrop-blur-sm hover:bg-red-600 border border-red-400/30 shadow-lg shadow-red-500/25"
                          onClick={() => handlePauseVideo(video.id)}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5 text-white"><rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/></svg>
                        </Button>
                        <Button
                          size="lg"
                          variant="outline"
                          className="bg-purple-600/90 backdrop-blur-sm hover:bg-purple-600 border border-purple-400/30 text-white hover:text-white shadow-lg shadow-purple-500/25"
                          onClick={() => handleInstagramClick(video.instagramUrl)}
                        >
                          <Instagram className="h-5 w-5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div className="p-8" style={{ minHeight: '120px' }}>
                    <h3 className="font-semibold text-white group-hover:text-blue-400 transition-colors text-lg mb-2">
                      {video.title}
                    </h3>
                    <button
                      className="text-sm text-gray-400 hover:text-blue-400 transition-colors flex items-center cursor-pointer"
                      onClick={() => handleInstagramClick(video.instagramUrl)}
                    >
                      <Instagram className="h-4 w-4 mr-2" />
                      Watch on Instagram →
                    </button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div 
                key={index} 
                className="text-center group hover:scale-110 transition-all duration-500"
                style={{
                  animationDelay: `${index * 100}ms`
                }}
              >
                <div className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform duration-300">
                  {stat.number}
                </div>
                <div className="text-gray-300 text-lg group-hover:text-white transition-colors">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-800/30 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 animate-fade-in">
              Why Choose <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">AlphaFly?</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto animate-fade-in">
              We provide world-class education with industry-relevant curriculum and hands-on experience.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card 
                key={index} 
                className="group hover:shadow-2xl transition-all duration-500 border-gray-700 bg-gray-800/50 backdrop-blur-sm hover:bg-gray-800/70 transform hover:scale-105 hover:-translate-y-2"
                style={{
                  animationDelay: `${index * 150}ms`
                }}
              >
                <CardContent className="p-8 text-center">
                  <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg shadow-blue-500/25">
                    <feature.icon className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-4 group-hover:text-blue-400 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-300 group-hover:text-gray-200 transition-colors">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Courses Section with Carousel */}
      <section id="courses" className="py-20 bg-gray-900 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Popular <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Courses</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Choose from our comprehensive range of courses designed to meet industry demands.
            </p>
          </div>

          <div className="max-w-7xl mx-auto">
            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              className="w-full"
            >
              <CarouselContent className="-ml-2 md:-ml-4">
                {courses.map((course, index) => (
                  <CarouselItem key={index} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                    <Card className="group hover:shadow-2xl transition-all duration-700 border-gray-700 bg-gray-800/50 backdrop-blur-sm overflow-hidden transform hover:scale-105 hover:-translate-y-2 h-full">
                      <div className="h-2 bg-gradient-to-r from-blue-500 to-purple-600 group-hover:h-3 transition-all duration-300"></div>
                      <CardHeader className="pb-4">
                        <div className="flex items-center justify-between mb-4">
                          <Badge variant="secondary" className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                            {course.level}
                          </Badge>
                          <div className="flex items-center space-x-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm text-gray-300">{course.rating}</span>
                          </div>
                        </div>
                        <CardTitle className="group-hover:text-blue-400 transition-colors text-white text-xl">
                          {course.title}
                        </CardTitle>
                        <CardDescription className="text-gray-300">
                          {course.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4 mb-6">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-400">Duration:</span>
                            <span className="font-medium text-white">{course.duration}</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-400">Students:</span>
                            <span className="font-medium text-white">{course.students}+</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">{course.price}</span>
                            <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 hover:scale-105 transition-all duration-300 shadow-lg shadow-blue-500/25">
                              Enroll Now
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden md:flex -left-12 bg-gray-800/80 border-gray-700 text-white hover:bg-gray-700" />
              <CarouselNext className="hidden md:flex -right-12 bg-gray-800/80 border-gray-700 text-white hover:bg-gray-700" />
            </Carousel>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600/20 to-purple-600/20 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Start Your <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Journey?</span>
          </h2>
          <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto">
            Join thousands of students who have transformed their careers with AlphaFly Computer Education.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button 
              size="lg" 
              className="bg-white text-gray-900 hover:bg-gray-100 hover:scale-105 transition-all duration-300 text-lg px-8 py-4 shadow-2xl"
            >
              Get Started Today
              <ChevronRight className="ml-2 h-6 w-6" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white text-black hover:bg-white/10 hover:scale-105 transition-all duration-300 text-lg px-8 py-4"
            >
              Contact Us
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-gray-800 text-white py-16 relative">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="animate-fade-in">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-bold">AlphaFly</span>
              </div>
              <p className="text-gray-400 leading-relaxed">
                Empowering minds through quality computer education and practical training for a digital future.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-6 text-lg">Quick Links</h3>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#home" className="hover:text-blue-400 transition-colors">Home</a></li>
                <li><a href="#courses" className="hover:text-blue-400 transition-colors">Courses</a></li>
                <li><a href="#testimonials" className="hover:text-blue-400 transition-colors">Testimonials</a></li>
                <li><a href="#contact" className="hover:text-blue-400 transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-6 text-lg">Courses</h3>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#" className="hover:text-blue-400 transition-colors">Web Development</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Data Science</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Digital Marketing</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Programming</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-6 text-lg">Contact Info</h3>
              <ul className="space-y-3 text-gray-400">
                <li>📍 KS Complex, Subben Street, Old BusStand, Theni</li>
                <li>📞 +91 8015 8016 89</li>
                <li>✉️ alphafly.edu@gmail.com</li>
                <li>
                  <a href="https://instagram.com/alphaflyeducation" className="hover:text-blue-400 transition-colors flex items-center">
                    <Instagram className="h-4 w-4 mr-2" />
                    Follow us on Instagram
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2024 AlphaFly Computer Education. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
