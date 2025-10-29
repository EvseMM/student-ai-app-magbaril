import React from 'react';

const Landing = () => {
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-sm sticky top-0 z-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="font-bold text-xl text-indigo-600">Grading System</div>
            <div className="flex space-x-8">
              <a 
                href="/students" 
                className="text-gray-700 hover:text-indigo-600 transition-colors duration-200 font-medium"
              >
                Students
              </a>
              <a 
                href="/subjects" 
                className="text-gray-700 hover:text-indigo-600 transition-colors duration-200 font-medium"
              >
                Subjects
              </a>
              <a 
                href="/grades" 
                className="text-gray-700 hover:text-indigo-600 transition-colors duration-200 font-medium"
              >
                Grades
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Text Content */}
          <div className="space-y-8">
            <div>
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
                Hi, I'm <span className="text-indigo-600">Eves Mark Magbaril</span>
              </h1>
              <p className="text-xl text-gray-600 mb-6">
                Information Technology Student & Aspiring Adones Dancer
              </p>
            </div>

            {/* IT Journey Section */}
            <div className="bg-white/60 backdrop-blur-sm     rounded-2xl p-8 shadow-lg border border-white">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">My IT Journey</h2>
              
              <div className="space-y-6">
                {/* Year 1 */}
                <div className="relative pl-8 border-l-2 border-indigo-400">
                  <div className="absolute -left-2 top-0 w-4 h-4 bg-indigo-500 rounded-full"></div>
                  <h3 className="text-xl font-semibold text-gray-800">First Year - The Foundation</h3>
                  <p className="text-gray-600 mt-2">
                    Started with programming fundamentals in Python and Java. Learned data structures, 
                    algorithms, and basic web development. Built my first portfolio website and 
                    participated in coding competitions.
                  </p>
                </div>

                {/* Year 2 */}
                <div className="relative pl-8 border-l-2 border-indigo-400">
                  <div className="absolute -left-2 top-0 w-4 h-4 bg-indigo-500 rounded-full"></div>
                  <h3 className="text-xl font-semibold text-gray-800">Second Year - Deep Dive</h3>
                  <p className="text-gray-600 mt-2">
                    Explored database systems, operating systems, and computer networks. 
                    Developed full-stack applications using React and Node.js. Completed an 
                    internship where I worked on real-world software projects.
                  </p>
                </div>

                {/* Year 3 */}
                <div className="relative pl-8 border-l-2 border-indigo-400">
                  <div className="absolute -left-2 top-0 w-4 h-4 bg-indigo-500 rounded-full"></div>
                  <h3 className="text-xl font-semibold text-gray-800">Third Year - Specialization</h3>
                  <p className="text-gray-600 mt-2">
                    Focused on machine learning, cloud computing, and mobile development. 
                    Led a team project developing a campus navigation app. Started contributing 
                    to open-source projects and attended tech conferences.
                  </p>
                </div>

                {/* Current */}
                <div className="relative pl-8 border-l-2 border-indigo-400">
                  <div className="absolute -left-2 top-0 w-4 h-4 bg-indigo-500 rounded-full"></div>
                  <h3 className="text-xl font-semibold text-gray-800">Present - Looking Forward</h3>
                  <p className="text-gray-600 mt-2">
                    Currently exploring AI/ML applications and preparing for my final year project. 
                    Seeking opportunities to apply my skills in innovative software solutions 
                    and continue growing as a developer.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Profile Picture */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative">
              <div className="w-80 h-80 lg:w-96 lg:h-96 bg-linear-to-br from-indigo-400 to-purple-500 rounded-full shadow-2xl flex items-center justify-center">
                {/* Placeholder for profile picture - Replace with actual image */}
                <div className="w-76 h-76 lg:w-92 lg:h-92 bg-gray-200 rounded-full flex items-center justify-center">
                  <img 
                    className='w-76 h-76 lg:w-92 lg:h-92 rounded-full object-cover'
                    src="https://scontent.fmnl25-7.fna.fbcdn.net/v/t39.30808-6/535440873_1939029986919828_2012847128415568352_n.jpg?_nc_cat=111&ccb=1-7&_nc_sid=a5f93a&_nc_eui2=AeG6IXuASq5rwGXa9vXXrg79tX7U_Bo1Lam1ftT8GjUtqa689LkQ6LVY7J3mU3sguhOY99qOhGr5jekcwOpLQEcv&_nc_ohc=QVL436X-bFwQ7kNvwGBwjc3&_nc_oc=Adk8_gLHoH9RsbN9JN0Dhxo60ThjRx1ZZI9F5gDaGZ2eEHdakH4bcHAYeTuhyOtcGmw&_nc_zt=23&_nc_ht=scontent.fmnl25-7.fna&_nc_gid=aSB3PEjSYn00gZwjeQroVA&oh=00_AfdJJKWfyG_JeKR2MuBe6U7QHXwbes6s3eg_1n58pnbmWg&oe=69062420" 
                    alt="Profile.jpg" />
                </div>
              </div>
              
              {/* Floating elements for visual interest */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-yellow-400 rounded-full opacity-20 animate-pulse"></div>
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-green-400 rounded-full opacity-20 animate-pulse delay-1000"></div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 text-center shadow-lg border border-white">
            <div className="text-3xl font-bold text-indigo-600">50+</div>
            <div className="text-gray-600 mt-2">Projects Completed</div>
          </div>
          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 text-center shadow-lg border border-white">
            <div className="text-3xl font-bold text-indigo-600">3</div>
            <div className="text-gray-600 mt-2">Years of Experience</div>
          </div>
          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 text-center shadow-lg border border-white">
            <div className="text-3xl font-bold text-indigo-600">10+</div>
            <div className="text-gray-600 mt-2">Technologies Mastered</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;