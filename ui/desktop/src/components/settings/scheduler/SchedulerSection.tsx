import { useState, useEffect } from 'react';
import { SchedulingEngine, Settings } from '../../../utils/settings';

interface SchedulerSectionProps {
  onSchedulingEngineChange?: (engine: SchedulingEngine) => void;
}

export default function SchedulerSection({ onSchedulingEngineChange }: SchedulerSectionProps) {
  const [schedulingEngine, setSchedulingEngine] = useState<SchedulingEngine>('builtin-cron');

  useEffect(() => {
    // Load current scheduling engine setting
    const loadSchedulingEngine = async () => {
      try {
        const settings = (await window.electron.getSettings()) as Settings | null;
        if (settings?.schedulingEngine) {
          setSchedulingEngine(settings.schedulingEngine);
        }
      } catch (error) {
        console.error('Failed to load scheduling engine setting:', error);
      }
    };

    loadSchedulingEngine();
  }, []);

  const handleEngineChange = async (engine: SchedulingEngine) => {
    try {
      setSchedulingEngine(engine);

      // Save the setting
      await window.electron.setSchedulingEngine(engine);

      // Notify parent component
      if (onSchedulingEngineChange) {
        onSchedulingEngineChange(engine);
      }
    } catch (error) {
      console.error('Failed to save scheduling engine setting:', error);
    }
  };

  return (
    <div className="space-y-1">
      <div className="group hover:cursor-pointer">
        <div
          className={`flex items-center justify-between text-text-default py-2 px-2 ${schedulingEngine === 'builtin-cron' ? 'bg-background-muted' : 'bg-background-default hover:bg-background-muted'} rounded-lg transition-all`}
          onClick={() => handleEngineChange('builtin-cron')}
        >
          <div className="flex">
            <div>
              <h3 className="text-text-default text-xs">Built-in Cron (Default)</h3>
              <p className="text-xs text-text-muted mt-[2px]">
                Uses Goose's built-in cron scheduler. Simple and reliable for basic scheduling
                needs.
              </p>
            </div>
          </div>

          <div className="relative flex items-center gap-2">
            <input
              type="radio"
              name="schedulingEngine"
              value="builtin-cron"
              checked={schedulingEngine === 'builtin-cron'}
              onChange={() => handleEngineChange('builtin-cron')}
              className="peer sr-only"
            />
            <div
              className="h-4 w-4 rounded-full border border-border-default
                    peer-checked:border-[6px] peer-checked:border-black dark:peer-checked:border-white
                    peer-checked:bg-white dark:peer-checked:bg-black
                    transition-all duration-200 ease-in-out group-hover:border-border-default"
            ></div>
          </div>
        </div>
      </div>

      <div className="group hover:cursor-pointer">
        <div
          className={`flex items-center justify-between text-text-default py-2 px-2 ${schedulingEngine === 'temporal' ? 'bg-background-muted' : 'bg-background-default hover:bg-background-muted'} rounded-lg transition-all`}
          onClick={() => handleEngineChange('temporal')}
        >
          <div className="flex">
            <div>
              <h3 className="text-text-default text-xs">Temporal</h3>
              <p className="text-xs text-text-muted mt-[2px]">
                Uses Temporal workflow engine for advanced scheduling features. Requires Temporal
                CLI to be installed.
              </p>
            </div>
          </div>

          <div className="relative flex items-center gap-2">
            <input
              type="radio"
              name="schedulingEngine"
              value="temporal"
              checked={schedulingEngine === 'temporal'}
              onChange={() => handleEngineChange('temporal')}
              className="peer sr-only"
            />
            <div
              className="h-4 w-4 rounded-full border border-border-default
                    peer-checked:border-[6px] peer-checked:border-black dark:peer-checked:border-white
                    peer-checked:bg-white dark:peer-checked:bg-black
                    transition-all duration-200 ease-in-out group-hover:border-border-default"
            ></div>
          </div>
        </div>
      </div>

      <div className="mt-4 p-3 rounded-md">
        <p className="text-xs text-text-muted">
          <strong>Note:</strong> Changing the scheduling engine will apply to new Goose sessions.
          You will need to restart Goose for the change to take full effect. <br />
          The scheduling engines do not share the list of schedules.
        </p>
      </div>
    </div>
  );
}
