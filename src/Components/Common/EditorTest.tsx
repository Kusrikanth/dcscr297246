import { useState } from 'react';
import CustomTipTapEditor from './CustomTipTapEditor';
import TextToVoiceEditor from './TextToVoiceEditor';
import SubMenuMultiSelect from './SubMenuMultiSelect';
import CourseManagement from './VideoPlayer';
// import SelectContent from './SelectContent';

const hierarchicalOptions: any[] = [
  {
    id: "1",
    name: "State Standards",
    children: [
      {
        id: "2",
        name: "United States",
        children: [
          { id: "4", name: "California K12 Standards" },
              { id: "5", name: "DRDP2011-SA (complete version)" },
              { id: "6", name: "DRDP2010-SA (simplified version)" },
              { id: "7", name: "California Preschool/Transitional Kindergarten Learning Foundations" },
              { id: "8", name: "DRDP2015-INFANT-TODDLER Comprehensive View" }
        ]
      },
      { id: "13", name: "Canada" },
      { id: "14", name: "IB" },
      { id: "15", name: "Mexico" }
    ]
  },
  {
    id: "16",
    name: "CCSS",
    children: [
      { id: "17", name: "Math Standards" },
      { id: "18", name: "English Language Arts" },
    ]
  }
];

export default function EditorTest() {
    const [first, setfirst] = useState('')
    const [selectedStandards, setSelectedStandards] = useState<any>(null);
    const handleStandardsChange = (value: any) => {
        setSelectedStandards(value);
    };
    return (
        <>
            <div className="page-content tw-mt-10">
                <TextToVoiceEditor value={first} onChangeHndlr={(e:any) => { setfirst(e.target.value)}} />
                <CustomTipTapEditor name="editor-name" onChange={() => { }} />
                <SubMenuMultiSelect
                    onChange={handleStandardsChange}
                    value={selectedStandards}
                    options={hierarchicalOptions}
                    labelText='Select Submenu'
                />
                <CourseManagement />
                {/* <SelectContent /> */}
            </div>
        </>
    );
};
