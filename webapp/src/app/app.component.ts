import { Component, OnInit } from '@angular/core';
import { Pipe, DatabaseService } from './database.service';
import { pipe } from '@angular/core/src/render3';

// TODO: budgeting and color coding
// - sort all pipes by priority
// - iterate green until budget is out
// - mark red all pipes out of budget
// - priorities:
//      overdue > nearest break date > furthest break date
// - filter by: overdue, in budget, out of budget

// TODO: map tab
// - create top navigation menu
// - create map routing component
// - add location to pipes
// - location filter: via circle (center, radius)
// - location filter: reverse geocoding support (address lookup)

const InBudgetColor = '#66bb6a'     // Green 400
const OutOfBudgetColor = '#ffca28'  // Amber 400
const OverdueColor = '#ef5350'      // Red 400

export interface Filter {
  name: string,
  allow(pipe: Pipe): boolean
}

export class StringFilter implements Filter {
  type = 'StringFilter'
  constructor(
    public name: string,
    public getValue: (pipe: Pipe) => string,
    public pattern: string = '',
  ) { }

  allow(pipe: Pipe) {
    let value = this.getValue(pipe).toLowerCase()
    let pattern = this.pattern.toLowerCase()

    // Contains substring.
    if (value.includes(pattern))
      return true

    // Regular expression match.
    try {
      if (value.match(pattern))
        return true
    }
    catch {}

    return false
  }
}

export class NumberFilter implements Filter {
  type = 'NumberFilter'
  constructor(
    public name: string,
    public getValue: (pipe: Pipe) => number,
    public min?: number,
    public max?: number,
  ) { }

  allow(pipe: Pipe) {
    let value = this.getValue(pipe) 
    if (this.min != undefined && value < this.min)
      return false
    if (this.max != undefined && value > this.max)
      return false
    return true
  }
}

export class DateFilter implements Filter {
  type = 'DateFilter'
  constructor(
    public name: string,
    public getValue: (pipe: Pipe) => Date,
    public start?: Date,
    public end?: Date,
  ) { }

  allow(pipe: Pipe) {
    let value = this.getValue(pipe) 
    if (this.start != undefined && value < this.start)
      return false
    if (this.end != undefined && value > this.end)
      return false
    return true
  }
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Predictive Maintenance';

  // Period information.
  periodBudget = 300000
  periodYears = 5

  // Filters.
  filters: Filter[] = [
    new StringFilter('Pipe ID', (pipe: Pipe) => pipe.id),
    new StringFilter('Material', (pipe: Pipe) => pipe.material),
    new NumberFilter('Diameter in inches', (pipe: Pipe) => pipe.diameter),
    new NumberFilter('Length in miles', (pipe: Pipe) => pipe.length),
    new DateFilter('Installation date', (pipe: Pipe) => new Date(pipe.installationDate)),
    new DateFilter('Last repair date', (pipe: Pipe) => new Date(pipe.lastRepairDate)),
    new DateFilter('Predicted break date', (pipe: Pipe) => new Date(pipe.predictedBreakDate)),
  ]

  // Chart.
  chartType = 'Timeline'
  chartColumnNames = [
    {id: 'id', type: 'string'},
    {id: 'description', type: 'string'},
    {id: 'start', type: 'date'},
    {id: 'end', type: 'date'},
  ]
  chartData: [string, string, Date, Date][] = []
  chartOptions: {colors: string[]} = {colors: []}

  private cachedPipes: Pipe[] | null = null

  constructor(private db: DatabaseService) { }

  ngOnInit() {
    // Cache the pipes from a query to the database.
    if (this.cachedPipes == null) {
      this.db.getPipes().subscribe((pipes: Pipe[]) => {
        this.cachedPipes = pipes
        this.updateChart()
      })
    }
  }

  allowWithFilters(pipe: Pipe) {
    for (let filter of this.filters) {
      if (!filter.allow(pipe)) {
        return false
      }
    }
    return true
  }

  updateChart() {
    if (this.cachedPipes == null) {
      this.chartData = []
      return
    }

    // Filter the pipes, sort them by priority and fill in the chart data.
    let periodEndDate = new Date()
    periodEndDate.setFullYear(periodEndDate.getFullYear() + this.periodYears)
    let periodEnd = periodEndDate.getTime() / 1000
    let pipes = this.cachedPipes
      .filter((pipe) =>
        this.allowWithFilters(pipe) && pipe.predictedBreakDate < periodEnd
      )
      .sort((a, b) => a.predictedBreakDate - b.predictedBreakDate)

    // Populate the chart rows.
    this.chartData = pipes.map((pipe) => [
      pipe.id,
      `$${pipe.repairCost.toFixed(2)}`,
      new Date(pipe.lastRepairDate * 1000),
      new Date(pipe.predictedBreakDate * 1000),
    ] as [string, string, Date, Date])

    let budgetUsed = 0
    let now = new Date().getTime() / 1000
    this.chartOptions.colors = pipes
      .map((pipe) => {
        budgetUsed += pipe.repairCost
        return pipe.predictedBreakDate < now ? OverdueColor
          : budgetUsed > this.periodBudget ? OutOfBudgetColor
          : InBudgetColor
      })
  }
}
