import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const input = document.querySelector('#datetime-picker');
const button = document.querySelector('[data-start]');
const allDateFields = document.querySelectorAll('.value');
button.disabled = true;
let userSelectedDate = null;
let interval = null;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    userSelectedDate = selectedDates[0];
    // interval = userSelectedDate - new Date();

    if (userSelectedDate <= Date.now()) {
      iziToast.error({
        color: 'red',
        position: 'topRight',
        message: `Please choose a date in the future`,
      });
      button.disabled = true;
      button.classList.remove('button-active');
    } else {
      button.disabled = false;
      button.classList.add('button-active');
    }
  },
};
const fp = flatpickr(input, options);

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}

button.addEventListener('click', () => {
  button.disabled = true;
  input.disabled = true;

  const intervalId = setInterval(() => {
    interval = userSelectedDate - Date.now();

    button.classList.remove('button-active');
    if (interval < 1) {
      clearInterval(interval);
      return;
    }
    const timer = convertMs(interval);
    allDateFields[0].innerText = addLeadingZero(timer.days);
    allDateFields[1].innerText = addLeadingZero(timer.hours);
    allDateFields[2].innerText = addLeadingZero(timer.minutes);
    allDateFields[3].innerText = addLeadingZero(timer.seconds);
  }, 1000);
});
