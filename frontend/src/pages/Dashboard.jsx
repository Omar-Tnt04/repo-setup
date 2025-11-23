import React, { useState } from 'react';
import { GlassCard, Button, TechBadge } from '../components/UI';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Plus, Briefcase, DollarSign, Users, Activity, Settings, Shield, AlertCircle, Clock, CheckCircle, TrendingUp } from 'lucide-react';

const freelancerData = [
  { name: 'Mon', jobs: 4, earnings: 240 },
  { name: 'Tue', jobs: 3, earnings: 139 },
  { name: 'Wed', jobs: 2, earnings: 980 },
  { name: 'Thu', jobs: 6, earnings: 390 },
  { name: 'Fri', jobs: 8, earnings: 480 },
  { name: 'Sat', jobs: 5, earnings: 380 },
  { name: 'Sun', jobs: 1, earnings: 100 },
];

const adminData = [
  { name: 'Jan', users: 400, jobs: 240, revenue: 12000 },
  { name: 'Feb', users: 300, jobs: 139, revenue: 15000 },
  { name: 'Mar', users: 500, jobs: 980, revenue: 22000 },
  { name: 'Apr', users: 478, jobs: 390, revenue: 18000 },
  { name: 'May', users: 589, jobs: 480, revenue: 25000 },
  { name: 'Jun', users: 639, jobs: 380, revenue: 28000 },
  { name: 'Jul', users: 749, jobs: 430, revenue: 32000 },
];

const Dashboard = () => {
  const [role, setRole] = useState('Freelancer');

  const FreelancerView = () => (
    <>
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 animate-fade-in-up">
         <GlassCard className="p-5 flex items-center justify-between">
            <div>
               <p className="text-sm text-gray-400 mb-1">Total Earnings</p>
               <h3 className="text-2xl font-bold text-white">$4,250.00</h3>
            </div>
            <div className="p-3 bg-emerald-500/10 rounded-full text-emerald-400 border border-emerald-500/20">
               <DollarSign size={20} />
            </div>
         </GlassCard>

         <GlassCard className="p-5 flex items-center justify-between">
            <div>
               <p className="text-sm text-gray-400 mb-1">Active Jobs</p>
               <h3 className="text-2xl font-bold text-white">12</h3>
            </div>
            <div className="p-3 bg-neonBlue/10 rounded-full text-neonBlue border border-neonBlue/20">
               <Briefcase size={20} />
            </div>
         </GlassCard>

         <GlassCard className="p-5 flex items-center justify-between">
            <div>
               <p className="text-sm text-gray-400 mb-1">Profile Views</p>
               <h3 className="text-2xl font-bold text-white">843</h3>
            </div>
            <div className="p-3 bg-neonPurple/10 rounded-full text-neonPurple border border-neonPurple/20">
               <Users size={20} />
            </div>
         </GlassCard>

         <GlassCard className="p-5 flex items-center justify-between">
            <div>
               <p className="text-sm text-gray-400 mb-1">Success Score</p>
               <h3 className="text-2xl font-bold text-white">98%</h3>
            </div>
            <div className="p-3 bg-neonOrange/10 rounded-full text-neonOrange border border-neonOrange/20">
               <Activity size={20} />
            </div>
         </GlassCard>
      </div>

      {/* Charts & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
        {/* Main Chart */}
        <div className="lg:col-span-2 space-y-8">
           <GlassCard className="min-h-[400px]">
              <div className="flex justify-between items-center mb-6">
                 <h3 className="text-lg font-semibold">Financial Performance</h3>
                 <TechBadge label="Real-time" color="bg-green-500" />
              </div>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={freelancerData}>
                    <defs>
                      <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                    <Tooltip
                       contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px' }}
                       itemStyle={{ color: '#e2e8f0' }}
                    />
                    <Area type="monotone" dataKey="earnings" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorEarnings)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
           </GlassCard>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <GlassCard>
                <h3 className="text-lg font-semibold mb-4">Job Distribution</h3>
                <div className="h-[200px] w-full">
                   <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={freelancerData}>
                         <XAxis dataKey="name" hide />
                         <Tooltip cursor={{fill: 'rgba(255,255,255,0.05)'}} contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155' }} />
                         <Bar dataKey="jobs" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                      </BarChart>
                   </ResponsiveContainer>
                </div>
             </GlassCard>
             <GlassCard className="relative overflow-hidden group cursor-pointer hover:border-neonPurple/50 transition-colors">
                <div className="absolute inset-0 bg-gradient-to-br from-neonBlue/20 to-neonPurple/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                <h3 className="text-lg font-semibold mb-2">Create New Job</h3>
                <p className="text-sm text-gray-400 mb-6">Use AI to generate a perfect job description in seconds.</p>
                <div className="flex justify-center items-center w-16 h-16 rounded-full bg-white/10 mx-auto border border-white/20 group-hover:bg-white/20 transition-all group-hover:scale-110">
                   <Plus size={32} className="text-white" />
                </div>
             </GlassCard>
           </div>
        </div>

        {/* Sidebar / Recent Activity */}
        <div className="space-y-6">
           <GlassCard>
              <h3 className="text-lg font-semibold mb-4">Active Projects</h3>
              <div className="space-y-4">
                 {[1, 2, 3].map((i) => (
                    <div key={i} className="p-3 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                       <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium">E-commerce React App</h4>
                          <span className="text-xs text-gray-500">2d ago</span>
                       </div>
                       <div className="w-full bg-gray-700 h-1.5 rounded-full overflow-hidden mb-2">
                          <div className="bg-neonBlue h-full rounded-full" style={{ width: `${i * 30}%` }} />
                       </div>
                       <div className="flex justify-between text-xs text-gray-400">
                          <span>Progress</span>
                          <span>{i * 30}%</span>
                       </div>
                    </div>
                 ))}
              </div>
              <Button variant="ghost" className="w-full mt-4 text-sm">View All Projects</Button>
           </GlassCard>

           <GlassCard>
              <div className="flex items-center gap-3 mb-4">
                 <div className="p-2 bg-neonPink/20 rounded-lg text-neonPink">
                    <Settings size={18} />
                 </div>
                 <div>
                    <h3 className="font-semibold text-sm">System Status</h3>
                    <p className="text-xs text-gray-400">All services operational</p>
                 </div>
              </div>
              <div className="space-y-2 text-xs text-gray-400">
                 <div className="flex justify-between"><span>API Latency</span><span className="text-emerald-400">24ms</span></div>
                 <div className="flex justify-between"><span>Database</span><span className="text-emerald-400">Connected</span></div>
                 <div className="flex justify-between"><span>Gemini AI</span><span className="text-emerald-400">Ready</span></div>
              </div>
           </GlassCard>
        </div>
      </div>
    </>
  );

  const AdminView = () => (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 animate-fade-in-up">
          <GlassCard className="p-5 flex items-center justify-between relative overflow-hidden">
             <div className="absolute right-0 top-0 p-4 opacity-5 pointer-events-none">
                <Users size={100} />
             </div>
             <div>
                <p className="text-sm text-gray-400 mb-1">Total Users</p>
                <h3 className="text-3xl font-bold text-white">8,432</h3>
                <span className="text-xs text-emerald-400 flex items-center gap-1"><TrendingUp size={12}/> +12% this week</span>
             </div>
             <div className="p-3 bg-neonBlue/10 rounded-full text-neonBlue border border-neonBlue/20 z-10">
                <Users size={24} />
             </div>
          </GlassCard>

          <GlassCard className="p-5 flex items-center justify-between">
             <div>
                <p className="text-sm text-gray-400 mb-1">Pending Jobs</p>
                <h3 className="text-3xl font-bold text-white">24</h3>
                <span className="text-xs text-amber-400 flex items-center gap-1"><Clock size={12}/> Review Required</span>
             </div>
             <div className="p-3 bg-amber-500/10 rounded-full text-amber-500 border border-amber-500/20">
                <AlertCircle size={24} />
             </div>
          </GlassCard>

           <GlassCard className="p-5 flex items-center justify-between">
             <div>
                <p className="text-sm text-gray-400 mb-1">Total Revenue</p>
                <h3 className="text-3xl font-bold text-white">$142.5k</h3>
                <span className="text-xs text-emerald-400 flex items-center gap-1">+$1.2k today</span>
             </div>
             <div className="p-3 bg-neonPurple/10 rounded-full text-neonPurple border border-neonPurple/20">
                <DollarSign size={24} />
             </div>
          </GlassCard>

          <GlassCard className="p-5 flex items-center justify-between">
             <div>
                <p className="text-sm text-gray-400 mb-1">System Status</p>
                <h3 className="text-3xl font-bold text-white">99.9%</h3>
                <span className="text-xs text-gray-500">Operational</span>
             </div>
             <div className="p-3 bg-neonOrange/10 rounded-full text-neonOrange border border-neonOrange/20">
                <Shield size={24} />
             </div>
          </GlassCard>
      </div>

       {/* Admin Content Grid */}
       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
          {/* Main Chart */}
          <GlassCard className="lg:col-span-2 min-h-[400px]">
              <div className="flex justify-between items-center mb-6">
                 <div>
                    <h3 className="text-lg font-semibold">Platform Growth</h3>
                    <p className="text-sm text-gray-400">User vs Revenue Trends</p>
                 </div>
                 <TechBadge label="Analytics" color="bg-neonPurple" />
              </div>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={adminData}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis yAxisId="left" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis yAxisId="right" orientation="right" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `${val/1000}k`} />
                    <Tooltip
                       contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px' }}
                       itemStyle={{ color: '#e2e8f0' }}
                    />
                    <Area yAxisId="right" type="monotone" dataKey="revenue" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" name="Revenue" />
                    <Area yAxisId="left" type="monotone" dataKey="users" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorUsers)" name="Users" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
          </GlassCard>

          {/* Pending Actions Feed */}
           <div className="space-y-6">
              <GlassCard className="h-full">
                 <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-semibold">Moderation Queue</h3>
                    <Button variant="ghost" className="text-xs !p-1 h-auto">View All</Button>
                 </div>

                 <div className="space-y-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                       <div key={i} className="flex gap-4 items-start p-3 rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/5 group">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${i % 2 === 0 ? 'bg-neonPurple/20 text-neonPurple' : 'bg-amber-500/20 text-amber-500'}`}>
                             {i % 2 === 0 ? <Users size={16} /> : <AlertCircle size={16} />}
                          </div>
                          <div className="flex-1">
                             <p className="text-sm font-medium text-gray-200">
                                {i % 2 === 0 ? 'New Freelancer Application' : 'Reported Job Posting'}
                             </p>
                             <p className="text-xs text-gray-500 mt-1">
                                {i % 2 === 0 ? 'Verified email, pending ID check.' : 'Flagged for suspicious content.'}
                             </p>
                          </div>
                          <div className="flex gap-1 opacity-50 group-hover:opacity-100 transition-opacity">
                             <button className="p-1.5 hover:bg-emerald-500/20 text-gray-400 hover:text-emerald-400 rounded transition-colors"><CheckCircle size={14} /></button>
                             <button className="p-1.5 hover:bg-red-500/20 text-gray-400 hover:text-red-400 rounded transition-colors"><AlertCircle size={14} /></button>
                          </div>
                       </div>
                    ))}
                 </div>
              </GlassCard>
           </div>
       </div>
    </>
  );

  return (
    <div className="max-w-7xl mx-auto w-full px-6 py-8">

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
        <div>
           <h2 className="text-3xl font-bold mb-1">
             {role === 'Admin' ? 'Admin Console' : 'Workspace'}
           </h2>
           <p className="text-gray-400">
             {role === 'Admin' ? 'System overview and moderation' : 'Welcome back, Thomas.'}
           </p>
        </div>

        <div className="flex bg-white/5 p-1 rounded-lg border border-white/10 overflow-x-auto max-w-full">
           {['Freelancer', 'Client', 'Admin'].map((r) => (
             <button
               key={r}
               onClick={() => setRole(r)}
               className={`px-4 py-2 rounded-md text-sm transition-all whitespace-nowrap ${role === r ? 'bg-white/10 text-white shadow-lg font-medium' : 'text-gray-400 hover:text-white'}`}
             >
               {r} View
             </button>
           ))}
        </div>
      </div>

      {role === 'Admin' ? <AdminView /> : <FreelancerView />}

    </div>
  );
};

export default Dashboard;
