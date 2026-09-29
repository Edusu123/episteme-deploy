'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import FullCalendar from '@fullcalendar/react';
import { Plus } from 'lucide-react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import ptBrLocale from '@fullcalendar/core/locales/pt-br';
import { DateSelectArg, EventClickArg } from '@fullcalendar/core';
import { researchEnvironments } from 'app/api/seed/mocks';

// Mock events data
const mockEvents = [
  {
    id: 'event-1',
    title: 'Reunião de Alinhamento',
    start: '2025-06-27T09:00:00',
    end: '2025-06-27T12:00:00',
    color: '#4f46e5',
    type: 'event',
    description: 'Reunião semanal de alinhamento da equipe'
  },
  {
    id: 'event-2',
    title: 'Apresentação dos Resultados',
    start: '2025-06-27T09:00:00',
    end: '2025-06-27T12:00:00',
    color: '#059669',
    type: 'event',
    description: 'Apresentação dos resultados preliminares da pesquisa'
  },
  {
    id: 'event-3',
    title: 'Workshop de Metodologia',
    start: '2025-06-27T09:00:00',
    end: '2025-06-27T12:00:00',
    color: '#dc2626',
    type: 'event',
    description: 'Workshop sobre metodologias de pesquisa'
  }
];

const mockTasks = {
  todo: [
    {
      id: 1,
      title: 'Revisar metodologia',
      description: 'Revisar e validar a metodologia da pesquisa',
      assignee: 'João Silva',
      dueDate: '2025-05-23'
    },
    {
      id: 2,
      title: 'Coletar dados',
      description: 'Iniciar coleta de dados para análise',
      assignee: 'Maria Santos',
      dueDate: '2025-05-24'
    }
  ],
  inProgress: [
    {
      id: 3,
      title: 'Análise preliminar',
      description: 'Realizar análise preliminar dos dados coletados',
      assignee: 'Pedro Oliveira',
      dueDate: '2025-05-25'
    }
  ],
  done: [
    {
      id: 4,
      title: 'Definir objetivos',
      description: 'Definir objetivos e metas da pesquisa',
      assignee: 'João Silva',
      dueDate: '2025-05-26'
    }
  ]
};

export type Task = {
  id: number;
  title: string;
  description: string;
  assignee: string;
  dueDate: string;
};

// Transform tasks into calendar events
function transformTasksToEvents(tasks: Task[]) {
  return tasks.map((task) => ({
    id: `task-${task.id}`,
    title: task.title,
    start: task.dueDate,
    allDay: true,
    color: '#f59e0b', // Amber color for tasks
    type: 'task',
    description: task.description,
    assignee: task.assignee
  }));
}

export default function page() {
  // Combine all tasks from different columns
  const allTasks = [
    ...mockTasks.todo,
    ...mockTasks.inProgress,
    ...mockTasks.done
  ];
  const taskEvents = transformTasksToEvents(allTasks);
  const allEvents = [...mockEvents, ...taskEvents];

  return (
    <div>
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
      <div className="grid grid-cols-3 content-start mt-5">
        {researchEnvironments.map((env: any) => (
          <a
            className="flex flex-col items-center bg-white border border-gray-200 rounded-lg shadow-sm md:flex-row md:max-w-xl hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
            href="#"
            key={env.id}
          >
            <img
              className="object-cover w-full rounded-t-lg h-96 md:h-auto md:w-48 md:rounded-none md:rounded-s-lg"
              src={env.imageUrl}
              alt=""
            />
            <div className="flex flex-col justify-between p-4 leading-normal">
              <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                {env.name}
              </h5>
              <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                {env.description}
              </p>
              {/* <UsersList
                        usersList={env.people.map((p: any) => ({
                          name: p.name,
                          profilePic: p.profilePic
                        }))}
                      /> */}
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
