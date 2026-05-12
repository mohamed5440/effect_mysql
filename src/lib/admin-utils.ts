/**
 * Helper to get status color based on application status
 */
export const getStatusColor = (status: string) => {
  switch (status) {
    case 'pending': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
    case 'reviewed': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
    case 'accepted': return 'text-green-400 bg-green-400/10 border-green-400/20';
    case 'rejected': return 'text-red-400 bg-red-400/10 border-red-400/20';
    default: return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
  }
};

/**
 * Helper to get status text in Arabic
 */
export const getStatusText = (status: string) => {
  switch (status) {
    case 'pending': return 'قيد الانتظار';
    case 'reviewed': return 'تمت المراجعة';
    case 'accepted': return 'مقبول';
    case 'rejected': return 'مرفوض';
    default: return status;
  }
};

/**
 * Mapping of expertise slugs to Arabic labels
 */
export const expertiseMap: { [key: string]: string } = {
  'digital-marketing': 'التسويق الرقمي',
  'video-editing': 'المونتاج وتحرير الفيديو',
  'graphic-design': 'التصميم الجرافيكي',
  'web-design': 'تصميم المواقع',
  'web-development': 'تطوير المواقع',
  'programming': 'البرمجة والتطبيقات',
  'content-creation': 'صناعة المحتوى',
  'media-buying': 'الميديا باينج',
  'other': 'أخرى'
};
