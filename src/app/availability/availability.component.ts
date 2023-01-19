import { Component, ViewEncapsulation, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import {MatCalendar, MatCalendarCellClassFunction} from '@angular/material/datepicker';
// import {
//   faCalendarPlus
// } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-availability',
  templateUrl: './availability.component.html',
  styleUrls: ['./availability.component.sass'],
  encapsulation: ViewEncapsulation.None
})

export class AvailabilityComponent implements OnInit{
  @ViewChild(MatCalendar) calendar!: MatCalendar<Date>

  exampleDates:any[]=[{id:"dasd21", mentorid:"d5d5", title:"Work time", days:["Mondar, Thursday"], from:"10:30", to:"13:30"},
  {id:"asda12", mentorid:"d5d5", title:"Work time", days:["Wednesday, Friday"], from:"15:30", to:"17:30"}]

  days:number[]=[]
  
  selected!: Date | null[];
  selectedDates: string[] = [];
  // datesAlreadySelected: string[] = [];

  //VALORES PARA MOSTRAR EN EL CALENDARIO
  daysOfTheWeekToDisplay:number[]=[]
  datesToDisplay:string[]=[]

  availabilityForm: FormGroup = new FormGroup({
    fromHour: new FormControl(''),
    toHour: new FormControl(''),
    dates: new FormControl('')
  })

  ngOnInit(): void {
    //VALORES AL ARRANCAR EL COMPONENTE
    this.availabilityForm
      .get('fromHour')?.setValue("10:00")

    this.availabilityForm
    .get('toHour')?.setValue("11:00")
  }

  @ViewChild('toast', { static:true })
  private toast:any;

  min!:string;
  max = '23:30';

  public onValidationFailed() {
    this.toast.open();
  }

    //SET LIMITS TO OPTIONS FOR THE HOUR
  limitToHourOptions(hour:any){
    
    const fromHourSelected = hour.split(':')
    const hourElement = parseInt(fromHourSelected[0])
    let hourInDisplay = hourElement < 9 ? `0${hourElement + 1}`:`${hourElement + 1}`
    const suggestTime = `${hourInDisplay}:${fromHourSelected[1]}`
  
    this.availabilityForm
      .get('toHour')?.setValue(suggestTime)
  
    this.min = suggestTime
  }

  //ENVIAR FORMULARIO
  sendData(){   
    let fromHour = this.availabilityForm.get('fromHour')?.value
    let toHour = this.availabilityForm.get('toHour')?.value

    const fromHourFixFormat:string = this.correctHourFormat(fromHour)
    const toHourFixFormat:string = this.correctHourFormat(toHour)


    this.availabilityForm.get('fromHour')!.setValue(fromHourFixFormat)
    this.availabilityForm.get('toHour')!.setValue(toHourFixFormat)

    console.log(this.availabilityForm.value)
  }
  
  correctHourFormat(hour:any){
      let correctHour:string = '00:00'
      
      if(typeof hour == "string"){
        const splitHour:string[] = hour.split(':')
        correctHour= `${splitHour[0]}:${splitHour[1]}`
      }
      return correctHour
  }

  //ESTABLECER ESTILO DEL CALENDARIO
  dateClass: MatCalendarCellClassFunction<Date> = (cellDate, view) => {
    if (view == 'month') {
      let dateToFind = this.getDateOnly(cellDate)

      let i = this.selectedDates.indexOf(dateToFind) 
      let j = this.datesToDisplay.indexOf(dateToFind)

      if (i >= 0) { return 'selected' }
      if (j >= 0) { return 'setted' }
    }
    return ''
  }

  //SELECCION DE DIAS
  daySelected(date: Date | null,calendar: any) {
    if (date) {
      let dateSelected = this.getDateOnly(date)
      let i = this.selectedDates.indexOf(dateSelected)
      
      if (i >= 0) {
        this.selectedDates.splice(i,1)
      } else {
        this.selectedDates.push(dateSelected)
      }
      calendar.updateTodaysDate();
    }
  }

  getDateOnly(date: Date):string {
    return date.toISOString().split('T')[0];
  }

  daysSelected(){
    const days = this.daysOfTheWeekToDisplay

    let daysSelected:string[]=[]

    days.forEach((day)=>{
      daysSelected = daysSelected.concat(this.getAllDaysInMonth(day))
    })
    this.datesToDisplay = daysSelected.sort()
    this.calendar.updateTodaysDate();
  }

  getAllDaysInMonth(day:number){
    const calendarViewDate:Date = this.calendar.activeDate;
    const year = calendarViewDate.getFullYear();
    const month = calendarViewDate.getMonth();

    const today = new Date()
    const todayMonth = today.getMonth()
    let number;
  
    if(month === todayMonth){
      number = today.getDate()
    } else if((month < todayMonth && year == today.getFullYear()) || year < today.getFullYear() ) {
      number = 32
    } else {
      number = 1
    }
    
    const daysToDisplayInCalendar = [];
    const newDate = new Date(year, month, number)

    while(newDate.getMonth() === month){
      if(newDate.getDay() == day){
        daysToDisplayInCalendar.push(this.getDateOnly(newDate))
      }
      newDate.setDate(newDate.getDate() + 1);
    }
    return daysToDisplayInCalendar
  }
  
  
  //ESTABLE LOS DIAS DE LA SEMANA Y TAMBIEN UN ARRAY CON SU VALOR NUMERICO
  setDaysofTheWeek(daysSelected:string[]){
    this.availabilityForm.get('dates')?.setValue(daysSelected)

    const DayToNumber = daysSelected.map((day:String) => {
      switch(day){
        case "Sunday":
          return 0;
        case "Monday":
          return 1;
        case "Tuesday":
          return 2;
        case "Wednesday":
          return 3;
        case "Thursday":
          return 4;
        case "Friday":
          return 5;
        case "Saturday":
          return 6;
        default:
          throw new Error("Invalid");
      }
    })
    this.daysOfTheWeekToDisplay = DayToNumber;
    this.daysSelected()
  }
  editar(){
    console.log("editar")
  }
  delete(){
    console.log("borrar")
  }
}

