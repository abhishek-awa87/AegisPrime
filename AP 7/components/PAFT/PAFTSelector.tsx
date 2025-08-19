import React from 'react';
import { useSessionStore } from '../../store/sessionStore';
import { PAFTContext } from '../../types/paft';
import PAFTCard from './PAFTCard';
import { useAppStore } from '../../store/appStore';

const PAFTSelector: React.FC = () => {
  const { 
    persona, setPersona, 
    audience, toggleAudience,
    format, setFormat,
    tone, setTone,
  } = useSessionStore();

  const { paftSuggestions } = useAppStore();
  
  if (!paftSuggestions) {
      return <div className="text-center p-8">Loading suggestions...</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <PAFTCard
        title="Persona"
        description="AI role and personality"
        options={paftSuggestions.persona}
        selection={persona}
        onSelect={setPersona}
      />
      <PAFTCard
        title="Audience"
        description="Target audience for the response"
        options={paftSuggestions.audience}
        selection={audience}
        onSelect={toggleAudience}
        isMultiSelect
      />
      <PAFTCard
        title="Format"
        description="Desired output format"
        options={paftSuggestions.format}
        selection={format}
        onSelect={setFormat}
      />
      <PAFTCard
        title="Tone"
        description="Communication style"
        options={paftSuggestions.tone}
        selection={tone}
        onSelect={setTone}
      />
    </div>
  );
};

export default PAFTSelector;