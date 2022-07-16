import './App.css';
import React, { useRef, useState } from 'react';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column, ColumnBodyOptions } from 'primereact/column';
import { Toast } from 'primereact/toast';

interface IColumn {
  field: any;
  header: String
}

function getColumns() {
  const startDate = new Date("07/15/2022");
  const endDate = new Date("07/25/2022");
  let currentDate = new Date(startDate);
  let idx = 0;
  const columns: IColumn[] = []
  while (currentDate <= new Date(endDate)) {
    columns.push({ field: idx, header: currentDate.toDateString() });
    // Use UTC date to prevent problems with time zones and DST
    currentDate.setUTCDate(currentDate.getUTCDate() + 1);
    idx++;
  }
  return columns;
}

function generateSchedule(): Map<string, number> {
  const startDate = new Date("07/15/2022");
  const endDate = new Date("07/25/2022");
  const dateArray: Map<string, number> = new Map();

  let currentDate = new Date(startDate);
  let idx = 0

  while (currentDate <= new Date(endDate)) {
    dateArray.set(new Date(currentDate).toDateString(), Math.floor(Math.random() * 12))
    // Use UTC date to prevent problems with time zones and DST
    currentDate.setUTCDate(currentDate.getUTCDate() + 1);
  }
  return dateArray;
}

function getScheduleMap(): Map<string, Map<string, number>> {
  const scheduleMap: Map<string, Map<string, number>> = new Map<string, Map<string, number>>();
  for (let letter = 65; letter < 75; letter++) {
    scheduleMap.set(`Room ${String.fromCharCode(letter)}`, generateSchedule());
  }
  return scheduleMap;
}

function App() {
  const [bookingDates, setBookingDates] = useState<Date | Date[] | undefined>(undefined);
  const [selectedRoom, setSelectedRoom] = useState(undefined);

  
  

  const [scheduleMap, setScheduleMap] = useState(getScheduleMap());
  let obj = Object.values(Array.from(scheduleMap.entries()))
  let obj1 = obj.map((x) => { return { roomId: x[0], schedule: Object.assign({}, Object.values(Array.from(x[1].values()))) }; });
  const [schedule, setSchedule] = useState(obj1);

  const toast = useRef<Toast>(null);


  function bookRoom() {
    if (typeof bookingDates == undefined) {
      toast?.current?.show({ severity: 'error', summary: 'Error Message', detail: 'No Dates Seleted', life: 3000 });
    } else if (bookingDates instanceof Array) {

      // Check if stock is available
      // let isAvailable = bookingDates.every((date) => scheduleMap.get(selectedRoom ?? "Room A")?.get(date.toDateString()) ?? -1 > -4);
      let isAvailable = true;

      if (isAvailable) {
        // Remove Dates from stock
        bookingDates.forEach((date) => scheduleMap.get(selectedRoom ?? "Room A")?.set(date.toDateString(), (scheduleMap.get(selectedRoom ?? "Room A")?.get(date.toDateString()) ?? 0) - 1))
        // Conversion
        let obj = Object.values(Array.from(scheduleMap.entries()))
        let obj1 = obj.map((x) => { return { roomId: x[0], schedule: Object.assign({}, Object.values(Array.from(x[1].values()))) }; });
        setSchedule(obj1);

        toast?.current?.show({ severity: 'success', summary: 'Success Message', detail: 'Reservation Booked', life: 3000 });

      } else {
        toast?.current?.show({ severity: 'error', summary: 'Error Message', detail: 'Error: No Availability', life: 3000 });

      }
    }
  }


  const roomOptions = obj1.map((room) => { return { label: `${room.roomId}`, value: room.roomId } })

  const columns = getColumns();



  const valueBodyTemplate = (data: any, options: ColumnBodyOptions) => {
    return <div className={`container value-${data.schedule[options.field.split('.')[1]]}`}><span > {data.schedule[options.field.split('.')[1]]}</span ></div>;
  }
  const dynamicColumns = columns.map((col, i) => {
    return <Column className="td" body={valueBodyTemplate} key={"schedule." + col.field} field={"schedule." + col.field} header={col.header} style={{ flexGrow: 1, flexBasis: '100px' }} />;
  });



  return (
    <div className="App">
      <Toast ref={toast} />
      <header className="App-header">

        <div className="card">
          <div className="card-container yellow-container overflow-hidden">
            <div className="flex">
              <div className="flex-1 flex align-items-center justify-content-center font-bold text-gray-900 m-2 px-5 py-3 border-round"><Card>
                <div className="card">
                  <DataTable scrollable scrollDirection="both" value={schedule} header="Accomodations Availability Matrix" footer="Footer" showGridlines responsiveLayout="scroll">
                    <Column field="roomId" header="Room" style={{ flexGrow: 1, flexBasis: '200px' }}></Column>
                    {dynamicColumns}
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
                  <Calendar id="range" value={bookingDates} onChange={(e) => setBookingDates(e.value)} selectionMode="multiple" readOnlyInput />
                </Card></div>
              <div className="flex-1 flex align-items-center justify-content-center font-bold text-gray-900 m-2 px-5 py-3 border-round">
                <Card><Button label="Book" onClick={() => bookRoom()} /></Card>
              </div>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}

export default App;
