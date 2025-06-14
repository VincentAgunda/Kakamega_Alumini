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
        return <TrophyIcon className="h-8 w-8 text-yellow-500" />;
      case 'academic': 
        return <AcademicCapIcon className="h-8 w-8 text-blue-500" />;
      case 'donor': 
        return <HeartIcon className="h-8 w-8 text-red-500" />;
      default: 
        return <TrophyIcon className="h-8 w-8 text-gray-500" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary dark:border-primary-dark"></div>
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
            Hall of Fame
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 dark:text-gray-400 sm:mt-4">
            Recognizing outstanding alumni achievements and contributions
          </p>
        </div>

        <div className="space-y-12">
          {Object.entries(groupedHonorees).map(([category, items]) => (
            <div key={category} className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center">
                  {getCategoryIcon(category)}
                  <h2 className="ml-3 text-xl font-bold text-gray-900 dark:text-white">
                    {getCategoryTitle(category)}
                  </h2>
                </div>
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.length > 0 ? (
                  items.map((alumni) => (
                    <div key={alumni.id} className="flex items-start">
                      <div className="flex-shrink-0 mr-4">
                        {alumni.photoURL ? (
                          <img 
                            src={alumni.photoURL} 
                            alt={alumni.name} 
                            className="h-16 w-16 rounded-full object-cover border-2 border-gray-200 dark:border-gray-600"
                          />
                        ) : (
                          <div className="bg-gray-200 dark:bg-gray-600 border-2 border-dashed rounded-full w-16 h-16 flex items-center justify-center">
                            <span className="text-xl font-bold text-gray-700 dark:text-gray-300">
                              {alumni.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                          {alumni.name}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Class of {alumni.year}
                        </p>
                        <p className="mt-1 text-gray-600 dark:text-gray-300">
                          {alumni.achievement}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-4">
                    <p className="text-gray-500 dark:text-gray-400">
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