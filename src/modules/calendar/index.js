import './calendar.scss'
import CalendarInstance from './calendar'

const DEFAULTS = {
  month: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August',
    'September', 'Oktober', 'November', 'Devember'],
  months: ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'],
  mon_index: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'],
  days_count: ['31', '0', '31', '30', '31', '30', '31', '31', '30', '31', '30', '31'],
  days_short: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
  week_days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],

  /* options */

  range: false,
  eventsMode: false,
  items: null,
  mode: 'd', // d, m, y
  setDate: false, // 01.01.2001
  disableDaysBefore: new Date(),
  disableDaysAfter: false, // new Date()
  onlyDates: [], // [31.10.2018, 01.11.2018, 02.11.2018, ...]
  labels: [], // [15000, 16000]
  labelFormat: '' // '... %DATA% ...'
}

const Calendar = function calendar(options) {
  if(!options) options = {}
}

function install(Vue) {
  Vue.component('b-calendar', {
    props: {
      options: {
        type: Object,
        default: () => {}
      }
    },
    data() {
      return {
        op: {},
        range: [],
        active: '',
        formShow: false,
        event: {
          date: '',
          title: '',
          content: ''
        }
      }
    },
    components: {
      CalendarInstance
    },
    computed: {
      baseDate() {
        return new Date()
      },
      date1() {
        return this.op.setDate
          ? this.isDate(this.op.setDate)
            ? this.op.setDate : new Date(this.getNativeDate(this.op.setDate))
          : new Date()
      },
      date2() {
        const date = new Date(this.date1.getTime())
        date.setDate(1)
        return new Date(date.setMonth(date.getMonth() + 1))
      }
    },
    watch: {
      options(o) {
        this.op = { ...DEFAULTS, ...o }
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
      emit() {
        this.$emit('rangeSelected', [
          this.getNativeDate(this.range[0]).toString(),
          this.getNativeDate(this.range[1]).toString()
        ])
      },
      apply() {
        if(this.range.length === 2) {
          this.emit()
        }
      },
      reset() {
        this.range = []
      },
      daySelected(date) {
        if(this.op.range) {
          if(!this.range.length) {
            this.range.push(date)
            return null
          }
          if(this.range.length === 1) {
            const r1 = this.getNativeDate(this.range[0]).getTime()
            const d = this.getNativeDate(date).getTime()
            if(d < r1) this.range.unshift(date)
            else this.range.push(date)
            // this.emit()
            return null
          }
          if(this.range.length === 2) {
            const r1 = this.getNativeDate(this.range[0]).getTime()
            const r2 = this.getNativeDate(this.range[1]).getTime()
            const d = this.getNativeDate(date).getTime()
            if(d < r1) {
              this.range = this.range.slice(1)
              this.range.unshift(date)
              // this.emit()
              return null
            }
            if(d > r2) {
              this.range = this.range.slice(0, 1)
              this.range.push(date)
              // this.emit()
              return null
            }
            if(d === r1 || d === r2 || (d > r1 && d < r2)) {
              this.range = []
              this.range.push(date)
            }
          }
        } else if(this.op.eventsMode) {
          this.formShow = true
          this.event.date = date
          this.$emit('formToggle', this.formShow)
          if(this.op.items && this.op.items[date]) {
            this.event.title = this.op.items[date].title
            this.event.content = this.op.items[date].content
          }
        } else {
          this.$emit('daySelected', this.getNativeDate(date))
        }
      },
      prevMonth() {
        const date = this.getNativeDate(this.date1)
        this.op.setDate = new Date(date.setMonth(date.getMonth() - 1))
      },
      nextMonth() {
        const date = this.getNativeDate(this.date1)
        date.setDate(1)
        this.op.setDate = new Date(date.setMonth(date.getMonth() + 1))
      },
      nextRangeMonth() {
        const date = this.getNativeDate(this.date1)
        date.setDate(1)
        this.op.setDate = new Date(date.setMonth(date.getMonth() + 1))
      },
      prevRangeMonth() {
        const date = this.getNativeDate(this.date1)
        this.op.setDate = new Date(date.setMonth(date.getMonth() - 1))
      },
      setActiveDate(date) {
        if(this.op.range && this.range.length === 1) {
          this.active = this.getNativeDate(date).toString()
        } else this.active = ''
      },
      setMonth(instanceId, index) {
        if(instanceId === 1) {
          const date = this.getNativeDate(this.date1)
          this.op.setDate = new Date(date.setMonth(index))
        }
        if(instanceId === 2) {
          const date = this.getNativeDate(this.date1)
          if(index === 0) {
            date.setFullYear(date.getFullYear() - 1)
            date.setMonth(11)
            this.op.setDate = new Date(date)
          } else this.op.setDate = new Date(date.setMonth(index))
        }
      },
      setYear(year) {
        const date = this.getNativeDate(this.date1)
        this.op.setDate = new Date(date.setFullYear(year))
      },
      setToday() {
        const date = this.getNativeDate(this.baseDate)
        this.op.setDate = new Date(date)
      },
      formClear() {
        this.event = { date: '', title: '', content: '' }
        this.formShow = false
        this.$emit('formToggle', this.formShow)
      },
      formSave() {
        if(this.event.title && this.event.content) {
          this.$emit('save', this.event)
          this.formClear()
        }
      },
      formRemove() {
        this.$emit('remove', this.event.date)
        this.formClear()
      }
    },
    created() {
      this.op = { ...DEFAULTS, ...this.options }
    },
    render(h) {
      const instances = (this.op.range ? [1, 2] : [1]).map((el, index) => {
        return h(
          'calendar-instance',
          {
            key: el,
            props: {
              index: el,
              range: this.range,
              active: this.active,
              options: {
                ...this.op,
                setDate: index === 0 ? this.date1 : this.date2
              }
            },
            on: {
              daySelected: (date) => this.daySelected(date),
              nextMonth: () => this.nextRangeMonth(),
              prevMonth: () => this.prevRangeMonth(),
              activeDate: (date) => this.setActiveDate(date),
              setMonth: (index) => this.setMonth(el, index),
              setYear: (year) => this.setYear(year),
              setToday: () => this.setToday(),
              setHeader: (val) => this.$emit('setHeader', val)
            }
          },
          []
        )
      })

      const formOverlay = h(
        'div',
        {
          staticClass: 'b-calendar-form-overlay',
          on: {
            click: () => { this.formClear() }
          }
        }
      )

      const form = h(
        'div',
        {
          staticClass: 'b-calendar-form'
        },
        [
          h(
            'div',
            {
              staticClass: 'b-calendar-form-close',
              on: {
                click: (e) => {
                  e.preventDefault()
                  this.formClear()
                }
              }
            }
          ),
          h(
            'form',
            {},
            [
              h(
                'input',
                {
                  domProps: {
                    value: this.event.title
                  },
                  attrs: {
                    type: 'text',
                    placeholder: 'Title'
                  },
                  on: {
                    input: (event) => { this.event.title = event.target.value }
                  }
                }
              ),
              h(
                'input',
                {
                  domProps: {
                    value: this.event.date
                  },
                  attrs: {
                    type: 'text',
                    readonly: true
                  }
                }
              ),
              h(
                'textarea',
                {
                  domProps: {
                    value: this.event.content
                  },
                  attrs: {
                    placeholder: 'Text'
                  },
                  on: {
                    input: (event) => { this.event.content = event.target.value }
                  }
                }
              ),
              h(
                'div',
                {
                  staticClass: 'flex-end shrink-0'
                },
                [
                  h(
                    'button',
                    {
                      staticClass: 'btn btn-default m-r-15',
                      on: {
                        click: (e) => {
                          e.preventDefault()
                          this.formRemove()
                        }
                      }
                    },
                    'Remove'
                  ),
                  h(
                    'button',
                    {
                      staticClass: 'btn btn-primary',
                      on: {
                        click: (e) => {
                          e.preventDefault()
                          this.formSave()
                        }
                      }
                    },
                    'Save'
                  )
                ]
              )
            ]
          )
        ]
      )

      const wrap = h(
        'div',
        {
          staticClass: 'b-calendar-wrap',
          class: {
            'b-calendar-range': this.op.range
          }
        },
        this.op.eventsMode
          ? this.formShow
            ? [...instances, formOverlay, form]
            : instances
          : instances
      )

      return h(
        'div',
        {
          staticClass: 'b-calendar-card'
        },
        [wrap]
      )
    }
  })
}

Calendar.install = install
Calendar.NAME = 'BCalendar'

export default Calendar
