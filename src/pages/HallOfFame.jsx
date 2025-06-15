import useFirestore from '../hooks/useFirestore';
import { TrophyIcon, AcademicCapIcon, HeartIcon } from '@heroicons/react/24/outline';

export default function HallOfFame() {
  const { data: honorees, loading } = useFirestore('hallOfFame');

  // Helper function to translate category names
  const getCategoryTitle = (category) => {
    switch(category) {
      case 'distinguished': return 'Distinguished Alumni';
      case 'academic': return 'Academic Achievers';
      case 'donor': return 'Golden Givers';
      default: return category;
    }
  };

  // Helper function to get category icon
  const getCategoryIcon = (category) => {
    switch(category) {
      case 'distinguished': 
        return <TrophyIcon className="h-6 w-6 text-[#ffc947]" />;
      case 'academic': 
        return <AcademicCapIcon className="h-6 w-6 text-[#ffc947]" />;
      case 'donor': 
        return <HeartIcon className="h-6 w-6 text-[#ffc947]" />;
      default: 
        return <TrophyIcon className="h-6 w-6 text-[#ffc947]" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f0f2f5] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#ffc947]"></div>
      </div>
    );
  }

  // Group honorees by category
  const groupedHonorees = {
    distinguished: honorees.filter(h => h.category === 'distinguished'),
    academic: honorees.filter(h => h.category === 'academic'),
    donor: honorees.filter(h => h.category === 'donor')
  };

  return (
    <div className="min-h-screen bg-[#f0f2f5] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-[#333] sm:text-4xl">
            Hall of Fame
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-lg text-gray-600 sm:mt-4">
            Recognizing outstanding alumni achievements and contributions
          </p>
        </div>

        <div className="space-y-8">
          {Object.entries(groupedHonorees).map(([category, items]) => (
            <div key={category} className="bg-white rounded-2xl shadow-md overflow-hidden">
              <div className="p-5 bg-[#e8ecef] border-b border-gray-200">
                <div className="flex items-center">
                  <div className="p-2 rounded-lg bg-white mr-3">
                    {getCategoryIcon(category)}
                  </div>
                  <h2 className="text-xl font-bold text-[#333]">
                    {getCategoryTitle(category)}
                  </h2>
                </div>
              </div>
              <div className="p-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {items.length > 0 ? (
                  items.map((alumni) => (
                    <div 
                      key={alumni.id} 
                      className="flex items-start p-4 bg-[#f8f9fa] hover:bg-[#e8ecef] rounded-xl transition"
                    >
                      <div className="flex-shrink-0 mr-4">
                        {alumni.photoURL ? (
                          <img 
                            src={alumni.photoURL} 
                            alt={alumni.name} 
                            className="h-14 w-14 rounded-full object-cover border-2 border-white shadow"
                          />
                        ) : (
                          <div className="bg-[#e8ecef] border-2 border-dashed rounded-full w-14 h-14 flex items-center justify-center">
                            <span className="text-sm font-bold text-[#333]">
                              {alumni.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base font-bold text-[#333] truncate">
                          {alumni.name}
                        </h3>
                        <p className="text-xs text-gray-600">
                          Class of {alumni.year}
                        </p>
                        <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                          {alumni.achievement}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-4">
                    <p className="text-gray-600">
                      No {getCategoryTitle(category).toLowerCase()} listed yet
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}