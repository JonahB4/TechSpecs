import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';

const EducationCareerPanel = () => {
  const [selectedMajor, setSelectedMajor] = useState('');
  const [selectedCareer, setSelectedCareer] = useState('');

  // Get majors from the Education class
  const majors = {
    BUSINESS: {
      name: "Business",
      cost: 15000,
      careers: ["manager", "consultant", "entrepreneur"],
      intelligence_requirement: 60
    },
    MEDICINE: {
      name: "Medicine",
      cost: 25000,
      careers: ["doctor", "surgeon", "psychiatrist"],
      intelligence_requirement: 85
    },
    ENGINEERING: {
      name: "Engineering",
      cost: 20000,
      careers: ["software_engineer", "mechanical_engineer", "civil_engineer"],
      intelligence_requirement: 75
    },
    EDUCATION: {
      name: "Education",
      cost: 12000,
      careers: ["teacher", "principal", "professor"],
      intelligence_requirement: 65
    },
    ARTS: {
      name: "Arts",
      cost: 10000,
      careers: ["artist", "musician", "designer"],
      intelligence_requirement: 50
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          Education & Career Choices
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Education Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Choose Your Major</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(majors).map(([key, major]) => (
                <button
                  key={key}
                  onClick={() => setSelectedMajor(key)}
                  className={`p-4 border rounded-lg text-left hover:bg-gray-50 transition-colors ${
                    selectedMajor === key ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                  }`}
                >
                  <div className="font-medium">{major.name}</div>
                  <div className="text-sm text-gray-500">Cost: ${major.cost}</div>
                  <div className="text-sm text-gray-500">
                    Intelligence Required: {major.intelligence_requirement}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Career Section - Only shown if graduated */}
          {selectedMajor && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Available Careers</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {majors[selectedMajor].careers.map((career) => (
                  <button
                    key={career}
                    onClick={() => setSelectedCareer(career)}
                    className={`p-4 border rounded-lg text-left hover:bg-gray-50 transition-colors ${
                      selectedCareer === career ? 'border-green-500 bg-green-50' : 'border-gray-200'
                    }`}
                  >
                    <div className="font-medium">
                      {career.split('_').map(word => 
                        word.charAt(0).toUpperCase() + word.slice(1)
                      ).join(' ')}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default EducationCareerPanel;