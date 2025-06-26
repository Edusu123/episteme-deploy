'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import ptBrLocale from '@fullcalendar/core/locales/pt-br';
import { EventClickArg, DateSelectArg } from '@fullcalendar/core';
import { Task } from './kanban-board';

// Mock events data
const mockEvents = [
  {
    id: 'event-1',
    title: 'Reunião de Alinhamento',
    start: '2024-03-25T10:00:00',
    end: '2024-03-25T11:00:00',
    color: '#4f46e5',
    type: 'event',
    description: 'Reunião semanal de alinhamento da equipe'
  },
  {
    id: 'event-2',
    title: 'Apresentação dos Resultados',
    start: '2024-03-26T14:00:00',
    end: '2024-03-26T15:30:00',
    color: '#059669',
    type: 'event',
    description: 'Apresentação dos resultados preliminares da pesquisa'
  },
  {
    id: 'event-3',
    title: 'Workshop de Metodologia',
    start: '2024-03-27T09:00:00',
    end: '2024-03-27T12:00:00',
    color: '#dc2626',
    type: 'event',
    description: 'Workshop sobre metodologias de pesquisa'
  }
];

// Transform tasks into calendar events
function transformTasksToEvents(tasks: Task[]) {
  return tasks.map((task) => ({
    id: `task-${task.taskId}`,
    title: task.title,
    start: task.dueDate,
    allDay: true,
    color: '#f59e0b', // Amber color for tasks
    type: 'task',
    description: task.description,
    assignee: task.assignedTo
  }));
}

interface CalendarTabProps {
  tasks: {
    todo: Task[];
    inProgress: Task[];
    done: Task[];
  };
}

export function CalendarTab({ tasks }: CalendarTabProps) {
  // Combine all tasks from different columns
  const allTasks = [...tasks.todo, ...tasks.inProgress, ...tasks.done];
  const taskEvents = transformTasksToEvents(allTasks);
  const allEvents = [...mockEvents, ...taskEvents];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Calendário</CardTitle>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Novo Evento
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[600px]">
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,timeGridDay'
            }}
            locale={ptBrLocale}
            events={allEvents}
            editable={true}
            selectable={true}
            selectMirror={true}
            dayMaxEvents={true}
            weekends={true}
            nowIndicator={true}
            height="100%"
            eventClick={(info: EventClickArg) => {
              const event = info.event;
              const eventData = event.extendedProps;

              if (eventData.type === 'task') {
                console.log('Task clicked:', {
                  title: event.title,
                  description: eventData.description,
                  assignee: eventData.assignee,
                  dueDate: event.start
                });
              } else {
                console.log('Event clicked:', {
                  title: event.title,
                  description: eventData.description,
                  start: event.start,
                  end: event.end
                });
              }
            }}
            select={(info: DateSelectArg) => {
              // Handle date selection
              console.log('Date selected:', info.start, info.end);
            }}
            eventContent={(eventInfo) => {
              const event = eventInfo.event;
              const eventData = event.extendedProps;

              return (
                <div className="flex items-center gap-1">
                  {eventData.type === 'task' && (
                    <span className="text-xs">📋</span>
                  )}
                  <span className="truncate">{event.title}</span>
                </div>
              );
            }}
          />
        </div>
      </CardContent>
    </Card>
  );
}
