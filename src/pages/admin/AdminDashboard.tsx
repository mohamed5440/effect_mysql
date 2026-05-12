import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { LogOut, Users, Clock, CheckCircle, XCircle, FileText, ChevronDown, Trash2, Search, Filter, Download, ArrowUpDown, MessageSquare, AlertCircle, LayoutDashboard, Send, ArrowUpLeft, Mail, Phone, MapPin, Briefcase, Code, DollarSign, User } from 'lucide-react';
import { sanitize } from '../../lib/security';
import { Application, Contact } from '../../types';
import { getStatusColor, getStatusText, expertiseMap } from '../../lib/admin-utils';

type FilterStatus = 'all' | 'pending' | 'reviewed' | 'accepted' | 'rejected';

function StatsCard({ title, value, icon: Icon, colorClass, delay = 0 }: { title: string, value: number, icon: any, colorClass: string, delay?: number }) {
  const isAccent = colorClass.includes('accent');
  const isYellow = colorClass.includes('yellow');
  const isGreen = colorClass.includes('green');
  const isRed = colorClass.includes('red');
  const isBlue = colorClass.includes('blue');
  
  const bgDir = isAccent ? 'from-accent/20 to-accent/5' :
                isYellow ? 'from-yellow-500/20 to-yellow-500/5' :
                isGreen ? 'from-green-500/20 to-green-500/5' :
                isRed ? 'from-red-500/20 to-red-500/5' :
                isBlue ? 'from-blue-500/20 to-blue-500/5' : 'from-white/20 to-white/5';

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="glass-card p-4 sm:p-6 flex items-center gap-3 sm:gap-4 cursor-default relative overflow-hidden group hover:bg-white/10 transition-all duration-300 border-white/5 hover:border-white/20"
    >
      <div className={`absolute -right-4 -top-4 w-24 h-24 rounded-full opacity-10 blur-2xl transition-transform duration-500 group-hover:scale-150 ${colorClass.split(' ')[0]}`}></div>
      <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br flex items-center justify-center shrink-0 shadow-lg ${bgDir}`}>
        <Icon className={`w-5 h-5 sm:w-6 sm:h-6 shrink-0 ${colorClass.split(' ')[1]}`} strokeWidth={2.5} />
      </div>
      <div className="relative z-10">
        <p className="text-white/40 text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-0.5 sm:mb-1">{title}</p>
        <p className="text-xl sm:text-2xl font-black text-white group-hover:text-accent transition-colors">{value}</p>
      </div>
    </motion.div>
  );
}

export default function AdminDashboard() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [expandedApp, setExpandedApp] = useState<number | null>(null);
  
  const [activeTab, setActiveTab] = useState<'applications' | 'contacts'>('applications');
  const [contacts, setContacts] = useState<Contact[]>([]);
  
  // New state for filtering and searching
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('all');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [isDeleting, setIsDeleting] = useState<number | null>(null);
  const [isUpdating, setIsUpdating] = useState<number | null>(null);
  const [toastMessage, setToastMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (isDeleting) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isDeleting]);

  useEffect(() => {
    const checkAuthAndFetch = async () => {
      setIsLoading(true);
      setFetchError(null);

      try {
        const token = localStorage.getItem('admin_token');
        const authHeaders = token ? { 'Authorization': `Bearer ${token}` } : {};

        const authRes = await fetch('/api/auth/me', { 
          credentials: 'include',
          headers: authHeaders
        });
        
        if (!authRes.ok) {
          localStorage.removeItem('admin_token');
          navigate('/admin/login');
          return;
        }

        // Fetch Applications
        const appRes = await fetch('/api/admin/applications', { 
          credentials: 'include',
          headers: authHeaders
        });
        if (!appRes.ok) throw new Error('Failed to fetch applications');
        const appData = await appRes.json();
        setApplications(appData);

        // Fetch Contacts
        const contactRes = await fetch('/api/admin/contacts', { 
          credentials: 'include',
          headers: authHeaders
        });
        if (!contactRes.ok) throw new Error('Failed to fetch contacts');
        const contactData = await contactRes.json();
        setContacts(contactData);

      } catch (err: any) {
        console.warn("Silent data fetch error:", err);
        setFetchError("لم نتمكن من عرض البيانات حالياً. يرجى المحاولة مرة أخرى لاحقاً.");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthAndFetch();
  }, [navigate]);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleLogout = async () => {
    try {
      // Clear token from UI first for immediate feedback
      localStorage.removeItem('admin_token');
      sessionStorage.clear();
      
      // Notify server to clear cookie
      await fetch('/api/auth/logout', { 
        method: 'POST', 
        credentials: 'include' 
      }).catch(() => {}); // Ignore error, we want to redirect anyway

      navigate('/admin/login', { replace: true });
    } catch (err) {
      console.error("Logout error:", err);
      navigate('/admin/login', { replace: true });
    }
  };

  const updateStatus = async (id: number, newStatus: Application['status']) => {
    setIsUpdating(id);
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`/api/admin/applications/${id}/status`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ status: newStatus }),
        credentials: 'include'
      });

      if (!response.ok) throw new Error('Failed to update status');

      setApplications(prev => prev.map(app => app.id === id ? { ...app, status: newStatus } : app));
      showToast('تم تحديث حالة الطلب بنجاح');
    } catch (error) {
      console.warn("Silent status update error:", error);
      showToast('لم نتمكن من إتمام العملية حالياً', 'error');
    } finally {
      setIsUpdating(null);
    }
  };

  const deleteItem = async (id: number) => {
    const endpoint = activeTab === 'applications' ? `/api/admin/applications/${id}` : `/api/admin/contacts/${id}`;
    setIsDeleting(id);
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(endpoint, { 
        method: 'DELETE', 
        credentials: 'include',
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });
      if (!response.ok) throw new Error('Failed to delete item');

      if (activeTab === 'applications') {
        setApplications(prev => prev.filter(app => app.id !== id));
      } else {
        setContacts(prev => prev.filter(contact => contact.id !== id));
      }

      showToast('تم الحذف بنجاح');
      setIsDeleting(null);
    } catch (error) {
      console.warn("Silent delete error:", error);
      showToast('لم نتمكن من إتمام عملية الحذف', 'error');
      setIsDeleting(null);
    }
  };

  // Filter and search logic
  const filteredData = useMemo(() => {
    const dataToFilter = activeTab === 'applications' ? applications : contacts;
    
    const result = dataToFilter.filter(item => {
      let searchStr: string;
      if (activeTab === 'applications') {
        const readableExpertise = expertiseMap[item.expertise] || item.expertise;
        searchStr = `${item.full_name} ${item.email} ${item.expertise} ${readableExpertise}`;
      } else {
        searchStr = `${item.full_name} ${item.email} ${item.subject} ${item.message}`;
      }
        
      const matchesSearch = searchStr.toLowerCase().includes(searchTerm.toLowerCase());
      
      if (activeTab === 'applications') {
        const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
        return matchesSearch && matchesStatus;
      }
      
      return matchesSearch;
    });

    result.sort((a, b) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });

    return result;
  }, [applications, contacts, searchTerm, statusFilter, sortOrder, activeTab]);

  const exportToCSV = () => {
    if (filteredData.length === 0) {
      showToast('لا توجد بيانات لتصديرها', 'error');
      return;
    }

    let headers: string[];
    let csvData: any[][];

    if (activeTab === 'applications') {
      headers = ['الاسم', 'البريد الإلكتروني', 'رقم الهاتف', 'الموقع', 'التخصص', 'الخبرة', 'المهارات', 'الحد الأدنى للأجر', 'الحد الأقصى للأجر', 'الحالة', 'تاريخ التقديم'];
      csvData = filteredData.map(app => [
        app.full_name,
        app.email,
        app.phone,
        app.location,
        app.expertise,
        app.experience,
        app.skills || '',
        app.min_rate || '',
        app.max_rate || '',
        getStatusText(app.status),
        new Date(app.created_at).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' })
      ]);
    } else {
      headers = ['الاسم', 'البريد الإلكتروني', 'رقم الهاتف', 'الموضوع', 'الرسالة', 'تاريخ الإرسال'];
      csvData = filteredData.map(contact => [
        contact.full_name,
        contact.email,
        contact.phone,
        contact.subject,
        contact.message,
        new Date(contact.created_at).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' })
      ]);
    }

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    const fileName = activeTab === 'applications' ? 'applications' : 'contacts';
    link.setAttribute('href', url);
    link.setAttribute('download', `${fileName}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('تم تصدير البيانات بنجاح');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-deep-black p-4 md:p-8 flex flex-col gap-8">
        <div className="max-w-6xl mx-auto w-full h-20 bg-white/5 rounded-2xl animate-pulse"></div>
        <div className="max-w-6xl mx-auto w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-28 bg-white/5 rounded-2xl animate-pulse"></div>)}
        </div>
        <div className="max-w-6xl mx-auto w-full h-12 bg-white/5 rounded-full animate-pulse max-w-md"></div>
        <div className="max-w-6xl mx-auto w-full flex flex-col gap-4">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-24 bg-white/5 rounded-2xl animate-pulse"></div>)}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-deep-black text-white p-4 pt-[calc(env(safe-area-inset-top,0px)+16px)] pb-[calc(env(safe-area-inset-bottom,0px)+16px)] md:p-8 md:pt-[calc(env(safe-area-inset-top,0px)+32px)] md:pb-[calc(env(safe-area-inset-bottom,0px)+32px)]" dir="rtl">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className={`fixed top-[calc(env(safe-area-inset-top,0px)+16px)] left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-full  border backdrop-blur-md font-medium text-sm flex items-center gap-2 ${
              toastMessage.type === 'success' 
                ? 'bg-green-500/20 border-green-500/30 text-green-400' 
                : 'bg-red-500/20 border-red-500/30 text-red-400'
            }`}
          >
            {toastMessage.type === 'success' ? <CheckCircle className="w-4 h-4 shrink-0" /> : <XCircle className="w-4 h-4 shrink-0" />}
            {toastMessage.text}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {isDeleting && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDeleting(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-deep-black border border-white/10 p-8 rounded-3xl max-w-sm w-full text-center"
            >
              <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center text-red-500 mx-auto mb-6 shrink-0">
                <Trash2 className="w-8 h-8 shrink-0" />
              </div>
              <h2 className="text-xl font-bold mb-2">حذف الطلب؟</h2>
              <p className="text-white/50 mb-8 text-sm">هل أنت متأكد من حذف هذا الطلب نهائياً؟ لا يمكن التراجع عن هذا الإجراء.</p>
              <div className="flex gap-3">
                <button 
                  id="confirm-delete-btn"
                  onClick={() => deleteItem(isDeleting)}
                  disabled={!!isUpdating || !!isDeleting && isUpdating !== null}
                  className="flex-1 bg-red-500 text-white py-3 rounded-xl font-bold hover:bg-red-600 transition-all disabled:opacity-50"
                >
                  حذف
                </button>
                <button 
                  id="cancel-delete-btn"
                  onClick={() => setIsDeleting(null)}
                  className="flex-1 bg-white/5 text-white py-3 rounded-xl font-bold hover:bg-white/10 transition-all border border-white/10"
                >
                  إلغاء
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 md:mb-10 glass-card p-4 md:p-6 hover:bg-white/5 hover:border-white/10">
        <div className="flex items-center justify-between w-full sm:w-auto gap-4">
          <div className="flex items-center gap-3 md:gap-4">
            <img 
              src="https://i.imghippo.com/files/XFCZ7651QcQ.png" 
              alt="شعار الموقع" 
              className="h-5 md:h-6 w-auto object-contain"
              referrerPolicy="no-referrer"
            />
            <div className="h-6 md:h-8 w-px bg-white/20"></div>
            <h1 className="text-sm md:text-xl font-bold whitespace-nowrap">لوحة التحكم</h1>
          </div>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button 
            id="admin-logout-btn"
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 text-white/60 hover:text-red-400 transition-colors text-xs md:text-sm font-medium bg-white/5 px-4 py-2.5 md:py-2 rounded-xl hover:bg-red-400/10 border border-transparent hover:border-red-400/20 w-full sm:w-auto shrink-0"
          >
            <span>تسجيل الخروج</span>
            <LogOut className="w-4 h-4 shrink-0" />
          </button>
        </div>
      </header>

      {/* Tabs */}
      <div className="max-w-6xl mx-auto mb-6 md:mb-8 flex gap-3 sm:gap-4">
        <button 
          id="tab-applications-btn"
          onClick={() => setActiveTab('applications')}
          className={`flex-1 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl font-bold transition-all flex items-center justify-center gap-2 sm:gap-3 border text-xs sm:text-base ${activeTab === 'applications' ? 'bg-accent border-accent text-white' : 'bg-white/5 border-white/10 text-white/50 hover:bg-white/10'}`}
        >
          <LayoutDashboard className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
          <span>الطلبات</span>
        </button>
        <button 
          id="tab-contacts-btn"
          onClick={() => setActiveTab('contacts')}
          className={`flex-1 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl font-bold transition-all flex items-center justify-center gap-2 sm:gap-3 border text-xs sm:text-base ${activeTab === 'contacts' ? 'bg-accent border-accent text-white' : 'bg-white/5 border-white/10 text-white/50 hover:bg-white/10'}`}
        >
          <Send className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
          <span>الرسائل</span>
        </button>
      </div>

      {/* Stats */}
      <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
        <StatsCard title="إجمالي الطلبات" value={applications.length} icon={Users} colorClass="bg-accent text-accent" delay={0.1} />
        <StatsCard title="قيد الانتظار" value={applications.filter(a => a.status === 'pending').length} icon={Clock} colorClass="bg-yellow-500 text-yellow-500" delay={0.15} />
        <StatsCard title="مراجعة" value={applications.filter(a => a.status === 'reviewed').length} icon={Search} colorClass="bg-blue-500 text-blue-500" delay={0.2} />
        <StatsCard title="مقبولة" value={applications.filter(a => a.status === 'accepted').length} icon={CheckCircle} colorClass="bg-green-500 text-green-500" delay={0.25} />
      </div>

      {/* Filters and Search */}
      <div className="max-w-6xl mx-auto mb-6 flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto -mx-4 px-4 sm:mx-0 sm:px-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {activeTab === 'applications' && (
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/5 border border-white/10 shrink-0 text-white/40">
                <Filter className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
              </div>
              {(['all', 'pending', 'reviewed', 'accepted', 'rejected'] as FilterStatus[]).map((status) => (
                <button
                  id={`filter-${status}-btn`}
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-4 py-2 sm:px-5 sm:py-2.5 rounded-full text-[11px] sm:text-sm font-bold whitespace-nowrap transition-all flex-shrink-0 border ${
                    statusFilter === status 
                      ? 'bg-accent border-accent text-white shadow-md shadow-accent/20' 
                      : 'bg-white/5 border-white/10 text-white/40 hover:bg-white/10'
                  }`}
                >
                  {status === 'all' ? 'الكل' : getStatusText(status)}
                </button>
              ))}
            </div>
          )}
          {activeTab === 'contacts' && (
            <div className="flex items-center gap-2 text-white/40 text-[11px] sm:text-sm font-medium bg-white/5 px-4 py-2 rounded-full border border-white/10 whitespace-nowrap">
              <MessageSquare className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
              <span>الرسائل الواردة ({contacts.length})</span>
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              id="sort-btn"
              onClick={() => setSortOrder(prev => prev === 'newest' ? 'oldest' : 'newest')}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full py-2.5 px-4 text-[11px] sm:text-xs md:text-sm text-white transition-all shadow-sm shrink-0"
              title={sortOrder === 'newest' ? 'الأحدث أولاً' : 'الأقدم أولاً'}
            >
              <ArrowUpDown className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white/60 shrink-0" />
              <span>{sortOrder === 'newest' ? 'الأحدث' : 'الأقدم'}</span>
            </button>
            <button
              id="export-btn"
              onClick={exportToCSV}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full py-2.5 px-4 text-[11px] sm:text-xs md:text-sm text-white transition-all shadow-sm shrink-0"
              title="تصدير إلى CSV"
            >
              <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white/60 shrink-0" />
              <span>تصدير</span>
            </button>
          </div>

          <div className="relative w-full sm:w-64 md:w-72 mt-1 sm:mt-0">
            <Search className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 text-white/40 shrink-0" />
            <input 
              aria-label="بحث"
              type="text" 
              placeholder="ابحث بالاسم، البريد..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-full py-2.5 pr-11 pl-4 text-xs sm:text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-accent/50 focus:bg-white/10 transition-all font-medium"
            />
          </div>
        </div>
      </div>

      {/* Applications/Contacts List */}
      <div className="max-w-6xl mx-auto">
        {fetchError ? (
          <div className="bg-red-500/10 border border-red-500/20 rounded-3xl p-12 text-center flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-4 text-red-500">
              <AlertCircle className="w-8 h-8 shrink-0" />
            </div>
            <h3 className="text-xl font-bold text-red-400 mb-2">تنبيه</h3>
            <p className="text-white/60 text-sm max-w-md mx-auto">نواجه حالياً صعوبة في استرجاع هذه البيانات، يرجى المحاولة بعد قليل.</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-6 bg-white/10 hover:bg-white/20 text-white px-6 py-2 rounded-xl transition-all border border-white/10"
            >
              إعادة المحاولة
            </button>
          </div>
        ) : filteredData.length === 0 ? (
          <div className="bg-white/5 border border-white/10 rounded-3xl p-16 text-center flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 text-white/20">
              <Search className="w-8 h-8 shrink-0" />
            </div>
            <h3 className="text-xl font-bold text-white/80 mb-2">لا توجد نتائج</h3>
            <p className="text-white/40 text-sm">لم نتمكن من العثور على أي {activeTab === 'applications' ? 'طلبات' : 'رسائل'} تطابق بحثك أو الفلتر المحدد.</p>
            {(searchTerm || statusFilter !== 'all') && (
              <button 
                onClick={() => { setSearchTerm(''); setStatusFilter('all'); }}
                className="mt-6 text-accent hover:text-accent-light text-sm font-medium transition-colors"
              >
                مسح الفلاتر
              </button>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <AnimatePresence mode="popLayout">
              {filteredData.map((item) => (
                <motion.div 
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden group"
                >
                  {/* Item Header (Clickable) */}
                  <div 
                    onClick={() => setExpandedApp(expandedApp === item.id ? null : item.id)}
                    className="p-5 md:p-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 cursor-pointer hover:bg-white/[0.08] transition-all"
                  >
                    <div className="flex items-center gap-3 sm:gap-4 flex-1">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-accent to-accent-dark text-white flex items-center justify-center font-bold text-base sm:text-lg shrink-0 shadow-lg shadow-accent/20 border border-white/10 group-hover:scale-105 transition-transform">
                        {item.full_name?.charAt(0).toUpperCase() || '?'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-base sm:text-lg text-white group-hover:text-accent transition-all truncate tracking-tight">
                          {sanitize(item.full_name || '')}
                        </h3>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-0.5">
                          <p className="text-white/40 text-[10px] sm:text-xs truncate font-medium">
                            {activeTab === 'applications' ? sanitize(item.expertise || '') : sanitize(item.subject || '')}
                          </p>
                          <span className="w-1 h-1 rounded-full bg-white/10 hidden sm:block"></span>
                          <div className="text-[10px] sm:text-xs text-white/20 flex items-center gap-1 font-medium italic">
                            <Clock className="w-3 h-3 shrink-0" />
                            <span>{item.created_at ? new Date(item.created_at).toLocaleDateString('ar-EG') : ''}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-6 border-t border-white/5 sm:border-0 pt-4 sm:pt-0">
                      <div className="flex items-center gap-2">
                        {activeTab === 'applications' && (
                          <span className={`px-3 py-1 sm:px-4 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-bold border backdrop-blur-sm whitespace-nowrap shadow-sm ${getStatusColor(item.status)}`}>
                            {getStatusText(item.status)}
                          </span>
                        )}
                        <div className={`w-8 h-8 rounded-full bg-white/5 flex items-center justify-center transition-all shrink-0 border border-white/5 ${expandedApp === item.id ? 'rotate-180 bg-accent/20 border-accent/20' : 'group-hover:bg-white/10'}`}>
                          <ChevronDown className={`w-4 h-4 shrink-0 transition-colors ${expandedApp === item.id ? 'text-accent' : 'text-white/40'}`} />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  <AnimatePresence>
                    {expandedApp === item.id && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="border-t border-white/10 bg-black/40"
                      >
                        <div className="p-5 md:p-8">
                          {activeTab === 'applications' ? (
                            <>
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                                <div className="space-y-4">
                                  <div className="bg-white/5 p-4 rounded-xl border border-white/5 group/field hover:bg-white/10 transition-colors">
                                    <div className="flex items-center gap-2 mb-1.5">
                                      <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-accent shrink-0" />
                                      <span className="text-accent/80 text-[10px] sm:text-xs font-bold uppercase tracking-wider italic">البريد الإلكتروني</span>
                                    </div>
                                    <a href={`mailto:${item.email}`} className="text-xs sm:text-sm text-white/90 hover:text-accent transition-colors block truncate font-medium">{sanitize(item.email || '')}</a>
                                  </div>
                                  <div className="bg-white/5 p-4 rounded-xl border border-white/5 group/field hover:bg-white/10 transition-colors">
                                    <div className="flex items-center gap-2 mb-1.5">
                                      <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-accent shrink-0" />
                                      <span className="text-accent/80 text-[10px] sm:text-xs font-bold uppercase tracking-wider italic">رقم الهاتف</span>
                                    </div>
                                    <a href={`tel:${item.phone}`} className="text-xs sm:text-sm text-white/90 hover:text-accent transition-colors block font-medium" dir="ltr">{sanitize(item.phone || '')}</a>
                                  </div>
                                  <div className="bg-white/5 p-4 rounded-xl border border-white/5 group/field hover:bg-white/10 transition-colors">
                                    <div className="flex items-center gap-2 mb-1.5">
                                      <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-accent shrink-0" />
                                      <span className="text-accent/80 text-[10px] sm:text-xs font-bold uppercase tracking-wider italic">الموقع الرسمي</span>
                                    </div>
                                    <p className="text-xs sm:text-sm text-white/90 font-medium">{sanitize(item.location || '')}</p>
                                  </div>
                                </div>
                                
                                <div className="space-y-4">
                                  <div className="bg-white/5 p-4 rounded-xl border border-white/5 group/field hover:bg-white/10 transition-colors">
                                    <div className="flex items-center gap-2 mb-1.5">
                                      <Briefcase className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-accent shrink-0" />
                                      <span className="text-accent/80 text-[10px] sm:text-xs font-bold uppercase tracking-wider italic">سنوات الخبرة</span>
                                    </div>
                                    <p className="text-xs sm:text-sm text-white/90 font-medium">{sanitize(item.experience || '')}</p>
                                  </div>
                                  {item.min_rate !== undefined && (
                                    <div className="bg-white/5 p-4 rounded-xl border border-white/5 group/field hover:bg-white/10 transition-colors">
                                      <div className="flex items-center gap-2 mb-1.5">
                                        <DollarSign className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-accent shrink-0" />
                                        <span className="text-accent/80 text-[10px] sm:text-xs font-bold uppercase tracking-wider italic">الأجر بالساعة (EGP)</span>
                                      </div>
                                      <p className="text-xs sm:text-sm text-white/90 font-medium" dir="ltr">{item.min_rate} - {item.max_rate}</p>
                                    </div>
                                  )}
                                  {item.portfolio && (
                                    <div className="bg-white/5 p-4 rounded-xl border border-white/5 group/field hover:bg-white/10 transition-colors">
                                      <div className="flex items-center gap-2 mb-1.5">
                                        <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-accent shrink-0" />
                                        <span className="text-accent/80 text-[10px] sm:text-xs font-bold uppercase tracking-wider italic">رابط الأعمال</span>
                                      </div>
                                      <a href={sanitize(item.portfolio || '')} target="_blank" rel="noopener noreferrer" className="text-xs sm:text-sm text-accent hover:text-accent-light hover:underline flex items-center gap-1.5 font-medium truncate group">
                                        معاينة الملف <ArrowUpLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:-translate-x-1 group-hover:-translate-y-1 transition-transform shrink-0" />
                                      </a>
                                    </div>
                                  )}
                                </div>

                                <div className="space-y-4 lg:col-span-1 md:col-span-2">
                                  <div className="bg-white/5 p-4 rounded-xl border border-white/5 h-full group/field hover:bg-white/10 transition-colors">
                                    <div className="flex items-center gap-2 mb-3">
                                      <Code className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-accent shrink-0" />
                                      <span className="text-accent/80 text-[10px] sm:text-xs font-bold uppercase tracking-wider italic">المهارات والأدوات</span>
                                    </div>
                                    <div className="flex flex-wrap gap-1.5">
                                      {item.skills?.split(',').map((skill: string, i: number) => (
                                        <span key={i} className="bg-accent/10 hover:bg-accent/20 text-accent text-[10px] sm:text-xs px-3 py-1 rounded-full border border-accent/20 font-bold transition-colors">
                                          {sanitize(skill.trim() || '')}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              </div>
                              
                              {item.bio && (
                                <div className="mb-8">
                                  <div className="flex items-center gap-2 mb-3">
                                    <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-accent shrink-0" />
                                    <span className="text-accent/80 text-[10px] sm:text-xs font-bold uppercase tracking-wider italic">نبذة عن المتقدم</span>
                                  </div>
                                  <p className="text-xs sm:text-sm text-white/70 leading-relaxed bg-black/40 p-5 rounded-2xl border border-white/10 font-medium whitespace-pre-wrap">{sanitize(item.bio || '')}</p>
                                </div>
                              )}
                            </>
                          ) : (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                              <div className="md:col-span-1 space-y-4">
                                <div className="bg-white/5 p-4 rounded-xl border border-white/5 group/field hover:bg-white/10 transition-colors">
                                  <div className="flex items-center gap-2 mb-1.5">
                                    <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-accent shrink-0" />
                                    <span className="text-accent/80 text-[10px] sm:text-xs font-bold uppercase tracking-wider italic">البريد الإلكتروني</span>
                                  </div>
                                  <a href={`mailto:${item.email}`} className="text-xs sm:text-sm text-white/90 hover:text-accent transition-colors block truncate font-medium">{sanitize(item.email || '')}</a>
                                </div>
                                <div className="bg-white/5 p-4 rounded-xl border border-white/5 group/field hover:bg-white/10 transition-colors">
                                  <div className="flex items-center gap-2 mb-1.5">
                                    <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-accent shrink-0" />
                                    <span className="text-accent/80 text-[10px] sm:text-xs font-bold uppercase tracking-wider italic">رقم الهاتف</span>
                                  </div>
                                  <a href={`tel:${item.phone}`} className="text-xs sm:text-sm text-white/90 hover:text-accent transition-colors block font-medium" dir="ltr">{sanitize(item.phone || '')}</a>
                                </div>
                                <div className="bg-white/5 p-4 rounded-xl border border-white/5 group/field hover:bg-white/10 transition-colors">
                                  <div className="flex items-center gap-2 mb-1.5">
                                    <MessageSquare className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-accent shrink-0" />
                                    <span className="text-accent/80 text-[10px] sm:text-xs font-bold uppercase tracking-wider italic">الموضوع</span>
                                  </div>
                                  <p className="text-xs sm:text-sm text-white/90 font-bold truncate">{sanitize(item.subject || '')}</p>
                                </div>
                              </div>
                              <div className="md:col-span-2">
                                <div className="bg-white/5 p-4 rounded-xl border border-white/5 h-full group/field hover:bg-white/10 transition-colors">
                                  <div className="flex items-center gap-2 mb-3">
                                    <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-accent shrink-0" />
                                    <span className="text-accent/80 text-[10px] sm:text-xs font-bold uppercase tracking-wider italic">نص الرسالة</span>
                                  </div>
                                  <p className="text-xs sm:text-sm text-white/80 leading-relaxed bg-black/40 p-5 rounded-2xl border border-white/10 min-h-[140px] font-medium whitespace-pre-wrap">{sanitize(item.message || '')}</p>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Actions */}
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pt-6 border-t border-white/10">
                            {activeTab === 'applications' && (
                              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                                <span className="text-[11px] sm:text-sm font-bold text-white/40 uppercase tracking-wider">تحديث حالة الطلب:</span>
                                <div className="grid grid-cols-2 sm:flex items-center gap-2">
                                  {(['pending', 'reviewed', 'accepted', 'rejected'] as FilterStatus[]).filter(s => s !== 'all').map((status) => (
                                    <button 
                                      key={status}
                                      id={`status-update-${status}-${item.id}`}
                                      onClick={() => updateStatus(item.id, status as any)}
                                      disabled={isUpdating === item.id}
                                      className={`px-4 py-2.5 rounded-xl text-[10px] sm:text-xs font-bold transition-all border shadow-sm ${
                                        isUpdating === item.id ? 'animate-pulse opacity-70' : ''
                                      } ${
                                        item.status === status 
                                          ? status === 'pending' ? 'bg-yellow-400 border-yellow-400 text-black shadow-yellow-400/20' 
                                          : status === 'reviewed' ? 'bg-blue-400 border-blue-400 text-black shadow-blue-400/20'
                                          : status === 'accepted' ? 'bg-green-400 border-green-400 text-black shadow-green-400/20'
                                          : 'bg-red-400 border-red-400 text-black shadow-red-400/20'
                                        : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10 hover:text-white hover:border-white/20'
                                      }`}
                                    >
                                      {getStatusText(status)}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            )}
                            
                            <button 
                              id={`delete-btn-${item.id}`}
                              onClick={() => setIsDeleting(item.id)}
                              className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-xs font-bold text-red-400 bg-red-400/10 hover:bg-red-500 hover:text-white transition-all border border-red-400/20 hover:border-red-500 shadow-sm shrink-0"
                            >
                              <Trash2 className="w-4 h-4 shrink-0" />
                              <span>حذف السجل</span>
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
