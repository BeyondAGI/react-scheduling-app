import './App.css';
import React, { useState } from 'react';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

interface IRoomScheduleDico { [roomId: string]: IRoomSchedule };

interface IRoomSchedule { roomId: string; schedule: ISchedule; };

interface ISchedule {
  j_01: number;
  j_02: number;
  j_03: number;
  j_04: number;
  j_05: number;
}

function generateSchedule(): Map<Date, number> {
  const startDate = new Date("07/01/2022");
  const endDate = new Date("09/01/2022")
  const dateArray: Map<Date, number> = new Map();

  let currentDate = new Date(startDate);

  while (currentDate <= new Date(endDate)) {
    dateArray.set(currentDate, Math.floor(Math.random() * 12))
    // Use UTC date to prevent problems with time zones and DST
    currentDate.setUTCDate(currentDate.getUTCDate() + 1);
  }
  return dateArray;
}

function App() {
  const [bookingDates, setBookingDates] = useState<Date | Date[] | undefined>(undefined);
  const [selectedRoom, setSelectedRoom] = useState(undefined);

  function bookRoom(roomId: string, dates: Date[]) {
  }
  const c = { "444": { ad: 1, ac: 2 } }

  const scheduleList: IRoomSchedule[] = [
    { roomId: "A", schedule: { j_01: 10, j_02: 10, j_03: 10, j_04: 10, j_05: 10 } },
    { roomId: "B", schedule: { j_01: 20, j_02: 30, j_03: 30, j_04: 30, j_05: 10 } },
    { roomId: "C", schedule: { j_01: 50, j_02: 50, j_03: 20, j_04: 30, j_05: 10 } },
    { roomId: "D", schedule: { j_01: 50, j_02: 50, j_03: 20, j_04: 30, j_05: 10 } },
    { roomId: "E", schedule: { j_01: 50, j_02: 50, j_03: 20, j_04: 30, j_05: 10 } },
  ];

  const scheduleMap: Map<string, Map<Date, number>> = new Map<string, Map<Date, number>>();
  for (let letter = 65; letter < 75; letter++) {
    scheduleMap.set(String.fromCharCode(letter), generateSchedule());
  }

  const roomOptions = scheduleList.map((room) => { return { label: `Room ${room.roomId}`, value: room.roomId } })

  console.log(Object.values(Array.from(scheduleMap.entries())))

  let roomSchedulesDico: IRoomScheduleDico = Object.assign({}, ...scheduleList.map((x) => ({ [x.roomId]: x })));


  const [schedules, setSchedules] = useState(scheduleList);

  return (
    <div className="App">
      <header className="App-header">

        <div className="card"> 
          <div className="card-container yellow-container overflow-hidden">
            <div className="flex">
              <div className="flex-1 flex align-items-center justify-content-center font-bold text-gray-900 m-2 px-5 py-3 border-round"><Card>
                <div className="card">
                  <p>{Object.values(scheduleMap)}</p>
                  <DataTable value={Object.values(Array.from(scheduleMap.entries()))} header="Accomodations Availability Matrix" footer="Footer" showGridlines responsiveLayout="scroll">
                    <Column field="0" header="Room"></Column>
                    <Column field="1.0" header="J+1"></Column>
                    <Column field="schedule.j_02" header="J+2"></Column>
                    <Column field="schedule.j_03" header="J+3"></Column>
                    <Column field="schedule.j_04" header="J+4"></Column>
                    <Column field="schedule.j_05" header="J+5"></Column>
                  </DataTable>
                </div>
              </Card></div>
            </div>
            <div className="flex">
              <div className="flex-1 flex align-items-center justify-content-center font-bold text-gray-900 m-2 px-5 py-3 border-round"><Card>
                <Dropdown value={selectedRoom} options={roomOptions} onChange={(e) => setSelectedRoom(e.value)} placeholder="Select a Room" />
              </Card></div>
              <div className="flex-1 flex align-items-center justify-content-center font-bold text-gray-900 m-2 px-5 py-3 border-round">
                <Card>
                  <Calendar id="range" value={bookingDates} onChange={(e) => setBookingDates(e.value)} selectionMode="range" readOnlyInput />
                </Card></div>
              <div className="flex-1 flex align-items-center justify-content-center font-bold text-gray-900 m-2 px-5 py-3 border-round">
                <Card><Button label="Book" /></Card>
              </div>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}

export default App;
