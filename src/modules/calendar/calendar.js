import Vue from 'vue'

const CalendarInstance = Vue.component('calendar-instance', {
  props: {
    index: Number,
    range: {
      type: Array,
      default: () => []
    },
    active: {
      type: String,
      default: ''
    },
    options: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      weeks: [],
      op: {},
      header: ''
    }
  },
  computed: {
    baseDate() {
      return new Date()
    },
    currentDate() {
      return this.op.setDate
        ? this.isDate(this.op.setDate)
          ? this.op.setDate
          : new Date(this.getNativeDate(this.op.setDate))
        : new Date()
    },
    baseDay() {
      return this.baseDate.getDate()
    },
    baseMonth() {
      return this.baseDate.getMonth()
    },
    baseYear() {
      return this.baseDate.getFullYear()
    }
  },
  watch: {
    'options.setDate'() {
      this.op = { ...this.options }
    },
    'op.setDate'() {
      if(this.op.mode === 'd') {
        this.render(this.currentDate)
      } else this.fillHeader()
    }
  },
  methods: {
    isDate(date) {
      let result = false
      if(Object.prototype.toString.call(date) === '[object date]') {
        if(!isNaN(date.getTime())) result = true
      }
      return result
    },
    getNativeDate(d) {
      if(/^(\d+).(\d+).(\d+)$/.test(d)) return new Date(d.replace(/^(\d+)\.(\d+)\.(\d+)$/, '$2/$1/$3'))
      const date = new Date(d)
      if(date instanceof Object && date.getTime instanceof Function) return date
      return 'Invalid date'
    },
    checkDisabled(date) {
      let result = false
      if(this.op.disableDaysBefore) {
        const nativeDate = this.getNativeDate(date).getTime()
        const currentDate = this.op.disableDaysBefore.getTime()
        if(currentDate > nativeDate) result = true
      }

      if(this.op.disableDaysAfter) {
        const nativeDate = this.getNativeDate(date).getTime()
        const currentDate = this.op.disableDaysAfter.getTime()
        if(currentDate < nativeDate) result = true
      }

      if(this.op.onlyDates && this.op.onlyDates.length) {
        if(!this.op.onlyDates.includes(date)) result = true
        // else {
        //   if(op.labels && op.labels.length) {
        //     var index = op.onlyDates.findIndex(function(item) { return item === date });
        //     if(index !== undefined && op.labels[index] !== undefined) {
        //       var label = op.labelFormat ? op.labelFormat.replace(/%DATA%/g, op.labels[index]) : op.labels[index];
        //       day.append($('<span>').addClass('jq-calendar__tooltip').append($('<i>').html(label)));
        //       day.attr('data-json', JSON.stringify({label: op.labels[index]}));
        //     }
        //   }
        // }
      }

      return result
    },
    fillHeader() {
      const currMon = this.currentDate.getMonth()
      const currYear = this.currentDate.getFullYear()
      this.header = this.op.month[currMon] + ' ' + currYear

      if(this.op.eventsMode) {
        this.$emit('setHeader', this.header)
      }
    },
    renderFirstWeek(e) {
      const currMon = e.getMonth()
      const currYear = e.getFullYear()
      const loastDayOfPrevMon = this.op.days_count[currMon === 0 ? 11 : currMon - 1]
      const g = new Date()

      g.setDate(1)
      g.setMonth(currMon)
      g.setFullYear(currYear)

      const weekday = g.getDay() === 0 ? 6 : g.getDay() - 1

      const week = {
        days: []
      }

      for(let i = 0; i < weekday; i++) {
        const num = loastDayOfPrevMon - weekday + i + 1
        const date = num + '.' + (currMon === 0 ? '12' : this.op.mon_index[currMon - 1]) + '.' + (currMon === 0 ? currYear - 1 : currYear)

        const isDisabled = this.checkDisabled(date)
        const isHoliday = i >= 5

        week.days.push({
          date,
          num,
          isPrevMonth: true,
          isDisabled,
          isHoliday
        })
      }

      let k = 0
      let result = 0
      for(let i = weekday; i <= 6; i++) {
        const num = ++k
        const date = '0' + k + '.' + this.op.mon_index[currMon] + '.' + currYear

        const isDisabled = this.checkDisabled(date)
        const isHoliday = i >= 5
        const isToday = num === +this.baseDay && +currMon === +this.baseMonth && +currYear === +this.baseYear

        if(i === 6) result = num

        week.days.push({
          date,
          num,
          isDisabled,
          isHoliday,
          isToday
        })
      }

      this.weeks.push(week)
      return result
    },
    render(e) {
      this.weeks = []
      const currMon = e.getMonth()
      const currYear = e.getFullYear()
      const g = new Date()

      g.setDate(e.getDate())
      g.setMonth(currMon)
      g.setFullYear(currYear)

      this.op.days_count[1] = e.getYear() % 4 === 0 ? '29' : '28'

      this.fillHeader()

      let num = this.renderFirstWeek(g) + 1
      let number = ''
      let date = ''
      let n = ''
      const count = +this.op.days_count[currMon]
      const weeksCount = 5
      const mon = this.op.mon_index[currMon]
      const nextMon = +mon === 12 ? '01' : this.op.mon_index[currMon + 1]
      const yearOfNextMon = +mon === 12 ? currYear + 1 : currYear

      this.op.mode = 'd'

      for(let j = 1; j <= weeksCount; j++) {
        const week = {
          days: []
        }
        for(let i = 0; i <= 6; i++) {
          let isNextMonth = false
          if(num <= count) {
            number = num
            date = ('0' + num).slice(-2) + '.' + mon + '.' + currYear
          } else {
            n = num - count
            number = n
            date = ('0' + n).slice(-2) + '.' + nextMon + '.' + yearOfNextMon
            isNextMonth = true
          }

          const isHoliday = i >= 5
          const isDisabled = this.checkDisabled(date)
          const isToday = +number === +this.baseDay && +currMon === +this.baseMonth && +currYear === +this.baseYear && !isNextMonth

          week.days.push({
            date,
            num: number,
            isNextMonth,
            isDisabled,
            isHoliday,
            isToday
          })
          num++
        }
        this.weeks.push(week)
      }
      return g
    },
    nextMonth() {
      const date = new Date(this.currentDate)
      date.setDate(1)
      date.setMonth(date.getMonth() + 1)
      this.gotoDate(date)
    },
    prevMonth() {
      const date = new Date(this.currentDate)
      date.setDate(1)
      date.setMonth(date.getMonth() - 1)
      this.gotoDate(date)
    },
    gotoDate(date) {
      this.dateChange(date)
    },
    dateChange(date) {
      this.op.setDate = new Date(date)
      this.render(this.currentDate)
    },
    btnPrevHandler(e) {
      e.preventDefault()
      const date = new Date(this.currentDate)
      switch(this.op.mode) {
        case 'd':
          if(this.op.range) {
            this.$emit('prevMonth')
          } else this.prevMonth()
          break
        case 'm':
          if(this.op.range) {
            return null
          } else {
            date.setFullYear(date.getFullYear() - 1)
            this.op.setDate = date
            this.fillHeader()
          }
          break
        case 'y':
          if(this.op.range) {
            return null
          } else {
            date.setFullYear(date.getFullYear() - 4)
            this.op.setDate = date
          }
      }
    },
    btnNextHandler(e) {
      e.preventDefault()
      const date = new Date(this.currentDate)
      switch(this.op.mode) {
        case 'd':
          if(this.op.range) {
            this.$emit('nextMonth')
          } else this.nextMonth()
          break
        case 'm':
          if(this.op.range) {
            return null
          } else {
            date.setFullYear(date.getFullYear() + 1)
            this.op.setDate = date
            this.fillHeader()
          }
          break
        case 'y':
          if(this.op.range) {
            return null
          } else {
            date.setFullYear(date.getFullYear() + 8)
            this.op.setDate = date
          }
      }
    },
    btnTodayHandler(e) {
      e.preventDefault()
      this.$emit('setToday')
    },
    btnMonthHandler(e) {
      e.preventDefault()
      if(this.op.mode !== 'm') {
        this.op.mode = 'm'
      }
    },
    btnYearHandler(e) {
      e.preventDefault()
      if(this.op.mode !== 'y') {
        this.op.mode = 'y'
      }
    },
    daySelection(date) {
      this.$emit('daySelected', date)
    },
    monthSelection(index) {
      this.$emit('setMonth', index)
    },
    yearSelection(year) {
      this.$emit('setYear', year)
    },
    inRange(date) {
      if(this.op.range && this.range.length === 2) {
        const r1 = this.getNativeDate(this.range[0]).getTime()
        const r2 = this.getNativeDate(this.range[1]).getTime()
        const d = this.getNativeDate(date).getTime()
        return d > r1 && d < r2
      }
      return false
    },
    inRangeHover(date) {
      const r1 = this.getNativeDate(this.range[0]).getTime()
      const d = this.getNativeDate(date).getTime()
      const a = this.getNativeDate(this.active).getTime()
      if(a > r1) {
        return d < a && d > r1
      }
      if(a < r1) {
        return d > a && d < r1
      }
      return false
    }
  },
  created() {
    this.op = { ...this.options }

    if(this.op.disableDaysBefore && this.op.disableDaysAfter) {
      this.op.disableDaysBefore = false
    }

    if(this.op.mode === 'd') this.render(this.currentDate)
    else this.fillHeader()
  },
  render(h) {
    const back = h(
      'button',
      {
        staticClass: 'b-calendar__back',
        on: {
          click: (e) => {
            this.btnPrevHandler(e)
          }
        }
      },
      []
    )
    const header = h(
      'div',
      {
        staticClass: 'b-calendar__header'
      },
      this.header
    )
    const forward = h(
      'button',
      {
        staticClass: 'b-calendar__forward',
        on: {
          click: (e) => this.btnNextHandler(e)
        }
      },
      []
    )

    const nav = h(
      'div',
      {
        staticClass: 'b-calendar__nav'
      },
      [back, header, forward]
    )

    const head = h(
      'div',
      {
        staticClass: 'b-calendar__head'
      },
      [
        [0, 1, 2, 3, 4, 5, 6].map((el, i) => {
          return h(
            'div',
            {},
            this.op.days_short[i]
          )
        })
      ]
    )

    const weeks = this.weeks.map((el, i) => {
      return h(
        'div',
        {
          staticClass: 'b-calendar__week',
          class: {
            'b-calendar__first-week': i === 0
          },
          key: i
        },
        [
          el.days.map((d, j) => {
            return h(
              'div',
              {
                key: d.date,
                attrs: {
                  'data-current': d.date,
                  'disabled': d.isDisabled
                },
                class: {
                  'b-calendar__prev-month': d.isPrevMonth,
                  'b-calendar__next-month': d.isNextMonth,
                  'b-calendar__holiday': d.isHoliday,
                  'b-calendar__today': d.isToday,
                  'b-calendar__range-start': this.op.range && d.date === this.range[0],
                  'b-calendar__range-end': this.op.range && d.date === this.range[1],
                  'b-calendar__in-range': this.inRange(d.date),
                  'b-calendar__range-hover': this.inRangeHover(d.date)
                },
                on: {
                  click: () => {
                    if(d.isDisabled) return null
                    else this.daySelection(d.date)
                  },
                  mouseover: () => this.$emit('activeDate', d.date)
                }
              },
              this.op.eventsMode
                ? [
                  h(
                    'span',
                    {},
                    `${i === 0 ? this.op.week_days[j] + ', ' : ''}${d.num}`
                  ),
                  h('div', {},
                    this.op.items
                      ? [
                        h('strong', {}, this.op.items[d.date] ? this.op.items[d.date].title : ''),
                        h('p', {}, this.op.items[d.date] ? this.op.items[d.date].content : '')
                      ]
                      : []
                  ),
                  h(
                    'div',
                    {
                      staticClass: 'b-calendar-spinner'
                    }
                  )
                ]
                : [h('span', {}, d.num)]
            )
          })
        ]
      )
    })

    const month = []
    for(let i = 0; i < 12; i++) {
      const y = this.currentDate.getFullYear()
      month.push(h(
        'div',
        {
          staticClass: 'b-calendar__month',
          class: {
            'b-calendar__today': i === this.baseMonth && y === this.baseYear
          },
          on: {
            click: () => this.monthSelection(i)
          }
        },
        this.op.month[i]
      ))
    }

    const year = []
    for(let i = 0; i <= 8; i++) {
      const y = this.currentDate.getFullYear() - 4 + i
      year.push(h(
        'div',
        {
          staticClass: 'b-calendar__year',
          class: {
            'b-calendar__today': y === this.baseYear
          },
          on: {
            click: () => this.yearSelection(y)
          }
        },
        y
      ))
    }

    const body = h(
      'div',
      {
        ref: 'body',
        staticClass: 'b-calendar__body'
      },
      this.op.eventsMode
        ? [weeks]
        : (this.op.mode === 'd' ? [head, weeks] : (this.op.mode === 'm' ? [month] : [year]))
    )

    const monthBtn = h(
      'button',
      {
        staticClass: 'b-calendar__month-btn',
        on: {
          click: (e) => this.btnMonthHandler(e)
        }
      },
      'Месяц'
    )

    const todayBtn = h(
      'button',
      {
        staticClass: 'b-calendar__today-btn',
        on: {
          click: (e) => this.btnTodayHandler(e)
        }
      },
      'Сегодня'
    )

    const yearBtn = h(
      'button',
      {
        staticClass: 'b-calendar__year-btn',
        on: {
          click: (e) => this.btnYearHandler(e)
        }
      },
      'Год'
    )

    const footer = h(
      'div',
      {
        staticClass: 'b-calendar__footer'
      },
      [monthBtn, todayBtn, yearBtn]
    )

    return h(
      'div',
      {
        staticClass: 'b-calendar',
        class: {
          'b-calendar--events': this.op.eventsMode
        }
      },
      this.op.eventsMode
        ? [body]
        : [nav, body, footer]
    )
  }
})

export default CalendarInstance
