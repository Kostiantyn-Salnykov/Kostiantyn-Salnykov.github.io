<template>
  <div class="container is-fullhd">
    <!--  Main site-->
    <section class="section pt-2 pb-0 mb-0 is-hidden-print">
      <div class="buttons mb-0">
        <button
          class="button is-responsive is-outlined"
          @click="showPrintModal = true"
          :class="[userTheme === 'dark-theme' ? 'is-primary' : 'is-danger', 'is-primary']"
        >
          <span class="icon is-small"><i class="fa-solid fa-print"></i></span>
          <span>Print</span>
        </button>
        <button class="button is-responsive" @click="toggleTheme" :class="{'is-black': userTheme === 'light-theme'}">
          <span class="icon is-small" v-if="userTheme === 'light-theme'"><i class="fa-solid fa-moon"></i></span>
          <span class="icon is-small" v-else><i class="fa-solid fa-sun"></i></span>
        </button>
      </div>
      <div class="modal" :class="{'is-active': showPrintModal}">
        <div class="modal-background" @click="showPrintModal = false"></div>
        <div class="modal-card">
          <header class="modal-card-head">
            <p class="modal-card-title has-text-black">Print resume</p>
            <button class="delete" aria-label="close" @click="showPrintModal = false"></button>
          </header>
          <section class="modal-card-body has-text-black is-flex is-flex-direction-column">
            <div class="content">
              <p class="has-text-justified">
                It's better to open this page via QR Code and read it without using paper for it.
              </p>
            </div>
            <QrcodeVue :value="cvURL" :size="200" render-as="svg" class="has-text-centered is-align-self-center" />
          </section>
          <footer class="modal-card-foot">
            <button class="button is-success" @click="showPrintModal = false">
              <span class="icon is-small"><i class="fa-solid fa-tree"></i></span>
              <span>Thanks</span>
            </button>
            <button
              class="button"
              @click="changeModal"
              :class="[userTheme === 'dark-theme' ? 'is-primary' : 'is-danger', 'is-primary']"
            >
              <span class="icon is-small"><i class="fa-solid fa-print"></i></span>
              <span>Print</span>
            </button>
          </footer>
        </div>
      </div>
      <div class="modal" :class="{'is-active': showPrintOptionsModal}">
        <div class="modal-background" @click="showPrintOptionsModal = false"></div>
        <div class="modal-card">
          <header class="modal-card-head">
            <p class="modal-card-title">Change print options</p>
            <button class="delete" aria-label="close" @click="showPrintOptionsModal = false"></button>
          </header>
          <section class="modal-card-body has-text-black is-flex is-flex-direction-column">
            <template v-for="(field_options, field_name) in printOptions" :key="field_name">
              <div class="field">
                <div class="control">
                  <template v-if="field_options.type === 'checkbox'">
                    <label class="checkbox">
                      <input type="checkbox" v-model="field_options.value" :disabled="field_options.is_disabled" />
                      {{ field_name }}
                    </label>
                  </template>
                  <template v-else-if="field_options.type === 'radio'">
                    <label class="label">{{ field_name }}</label>
                    <template v-for="option in field_options.options" :key="option.name">
                      <label class="radio">
                        <input type="radio" name="answer" :value="option.value" v-model="field_options.value" />
                        {{ option.name }}
                      </label>
                    </template>
                  </template>
                </div>
              </div>
            </template>
          </section>
          <footer class="modal-card-foot">
            <button class="button is-success" @click="changeModalBack">
              <span class="icon is-small"><i class="fa-solid fa-tree"></i></span>
              <span>Back</span>
            </button>
            <button
              class="button"
              @click="print"
              :class="[userTheme === 'dark-theme' ? 'is-primary' : 'is-danger', 'is-primary']"
            >
              <span class="icon is-small"><i class="fa-solid fa-print"></i></span>
              <span>Print</span>
            </button>
          </footer>
        </div>
      </div>
    </section>
    <section class="section pt-2 pb-0 is-hidden-print">
      <div class="title is-size-4-mobile has-text-link">{{ fullName }}</div>
      <div class="subtitle is-size-5-mobile has-text-info" v-html="position"></div>
    </section>
    <section class="section pt-2 is-hidden-print">
      <div class="columns is-multiline">
        <div class="column is-full-mobile is-one-quarter-tablet">
          <div class="content">
            <p class="title has-text-link mb-1">Contacts</p>
            <template v-for="contact in contacts" :key="contact.name">
              <div>
                <div class="control">
                  <div class="buttons has-addons pb-0 mb-0">
                    <a
                      :href="contact.type ? `${contact.type}:${contact.value}` : contact.value"
                      class="button is-responsive is-outlined"
                      :class="[userTheme === 'dark-theme' ? 'is-primary' : 'is-danger', 'is-primary']"
                      target="_blank"
                    >
                      <span class="icon is-small"><i :class="contact.icon"></i></span>
                      <span>{{ contact.name }}</span>
                    </a>
                    <button
                      class="button is-responsive is-outlined"
                      @click="copy(contact.value)"
                      :class="[userTheme === 'dark-theme' ? 'is-primary' : 'is-danger', 'is-primary']"
                    >
                      <span class="icon is-small"><i class="fa-regular fa-copy"></i></span>
                    </button>
                    <button
                      class="button is-responsive is-outlined"
                      @click="contact.modal = !contact.modal"
                      :class="[userTheme === 'dark-theme' ? 'is-primary' : 'is-danger', 'is-primary']"
                    >
                      <span class="icon is-small"><i class="fa-solid fa-qrcode"></i></span>
                    </button>
                  </div>
                  <div class="modal" :class="{'is-active': contact.modal}">
                    <div class="modal-background" @click="contact.modal = false"></div>
                    <div class="modal-content">
                      <section
                        class="modal-card-body round is-flex is-flex-direction-column is-justify-content-center is-align-items-center"
                      >
                        <p class="title has-text-black">{{ contact.name }}</p>
                        <QrcodeVue
                          :value="contact.type ? `${contact.type}:${contact.value}` : contact.value"
                          :size="250"
                          render-as="svg"
                          class="has-text-centered"
                        />
                      </section>
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </div>
        </div>
        <div class="column is-full-mobile is-one-quarter-tablet">
          <div class="content">
            <p class="title has-text-link mb-1">About Me</p>
            <template v-for="paragraph in paragraphs" :key="paragraph">
              <p class="indent has-text-justified" v-html="paragraph"></p>
            </template>
            <button
              class="button is-small is-outlined"
              @click="readMoreAboutModal = !readMoreAboutModal"
              :class="[userTheme === 'dark-theme' ? 'is-primary' : 'is-danger', 'is-primary']"
            >
              Read more
            </button>
            <div class="modal" :class="{'is-active': readMoreAboutModal}">
              <div class="modal-background" @click="readMoreAboutModal = false"></div>
              <div class="modal-card has-background round">
                <header class="modal-card-head has-background">
                  <p class="modal-card-title has-dynamic-text">About me</p>
                  <button class="delete" aria-label="close" @click="readMoreAboutModal = false"></button>
                </header>
                <section class="modal-card-body has-text-black has-background">
                  <div class="block image is-3by2">
                    <img src="/src/assets/photo.jpg" alt="Photo" class="round" />
                  </div>
                  <div class="block indent" v-html="p" v-for="p in aboutMeMore.paragraphs" :key="p"></div>
                  <div class="block">{{ aboutMeMore.dateOfBirth }}</div>
                  <div class="block">{{ aboutMeMore.martialStatus }}</div>
                  <div class="block">{{ aboutMeMore.hobbies }}</div>
                </section>
              </div>
            </div>
          </div>
        </div>
        <div class="column is-full-mobile is-one-quarter-tablet">
          <div class="content">
            <p class="title has-text-link mb-1">Details</p>
            <template v-for="detail in details" :key="detail.name">
              <template v-if="detail.name == 'Timezone'">
                <p class="py-0 my-0">{{ detail.name }}: {{ detail.value }}</p>
                <p>({{ tzDateTime }})</p>
              </template>
              <p v-else>{{ detail.name }}: {{ detail.value }}</p>
            </template>
          </div>
        </div>
        <div class="column is-full-mobile is-one-quarter-tablet">
          <div class="content">
            <p class="title has-text-link mb-1">Languages</p>
            <template v-for="lang in languages" :key="lang.name">
              <p>{{ lang.icon }} {{ lang.name }}: {{ lang.level }}</p>
            </template>
          </div>
        </div>
      </div>
    </section>
    <section class="section pt-2 is-hidden-print">
      <div class="title has-text-link mb-1">Technologies</div>
      <div class="columns is-gapless is-multiline is-mobile">
        <template v-for="category in technologies" :key="category.categoryName">
          <div class="column is-full-mobile is-half-tablet is-one-quarter-desktop">
            <div class="title is-size-4 has-text-link mb-0">
              {{ category.categoryName }}
            </div>
            <div class="content">
              <template v-for="block in category.blocks" :key="block.blockName">
                <p v-html="block.blockName + ': '" class="subtitle is-size-6 mt-2 mb-0"></p>
                <div class="">
                  <template v-for="item in block.items" :key="item.name">
                    <span class="tag is-info is-rounded is-outlined mr-1">{{ item.name }} {{ item.icon }}</span>
                  </template>
                </div>
              </template>
            </div>
          </div>
        </template>
      </div>
    </section>
    <section class="section pt-2 is-hidden-print">
      <div class="title has-text-link">Experience</div>
      <div class="columns is-flex is-flex-direction-column">
        <template v-for="exp in experience" :key="exp">
          <div class="column">
            <div class="title is-size-4 has-text-link">{{ exp.heading }}</div>
            <div class="subtitle is-6">({{ exp.fromDate }} - {{ exp.toDate }})</div>
            <div class="columns is-flex is-flex-wrap-wrap">
              <template v-for="project in exp.projects" :key="project.title">
                <div class="column is-full is-full-mobile is-vertical">
                  <div class="tile is-child">
                    <span class="icon-text has-text-info">
                      <span class="icon is-medium">
                        <i :class="project.icon"></i>
                      </span>
                      <span class="subtitle is-size-4 is-size-6-mobile">{{ project.title }} [{{ project.date }}]</span>
                    </span>
                    <br />
                    <button
                      class="button is-outlined is-small"
                      @click="openModalById(project.title)"
                      :class="[userTheme === 'dark-theme' ? 'is-primary' : 'is-danger', 'is-primary']"
                    >
                      Details
                    </button>
                    <div class="modal" :id="project.title">
                      <div class="modal-background" @click="closeModalById(project.title)"></div>
                      <div class="modal-card has-background round">
                        <header class="modal-card-head has-background">
                          <p class="modal-card-title has-dynamic-text">Project details</p>
                          <button class="delete" aria-label="close" @click="closeModalById(project.title)"></button>
                        </header>
                        <section class="modal-card-body has-text-black has-background">
                          <div class="block is-size-4">
                            <span class="has-text-link">Title</span>: {{ project.title }}
                          </div>
                          <div class="block is-size-4">
                            <span class="has-text-link">Description</span>: {{ project.description }}
                          </div>
                          <div class="block is-size-4">
                            <span class="has-text-link">Country</span>: {{ project.customer }}
                          </div>
                          <div class="block is-size-4">
                            <span class="has-text-link">Domain</span>:&nbsp;
                            <span class="icon-text">
                              <span class="icon has-text-link"><i :class="project.icon"></i></span>
                              <span>{{ project.domain }}</span>
                            </span>
                          </div>
                          <div class="block is-size-4">
                            <span class="has-text-link">Team size</span>: {{ project.teamSize }}
                          </div>
                          <div class="block is-size-4">
                            <span class="has-text-link">Position in team</span>: {{ project.positionInTeam }}
                          </div>
                          <div class="block is-size-4">
                            <span class="has-text-link">Used technologies</span>:
                            <span
                              class="tag is-info is-rounded is-outlined mr-1 is-medium"
                              v-for="tech in project.usedTechnologies"
                              :key="tech"
                              >{{ tech }}</span
                            >
                          </div>
                          <div class="block is-size-4" v-show="project.responsibilities">
                            <span class="has-text-link">Responsibilities</span>: {{ project.responsibilities }}
                          </div>
                          <div class="block is-size-4" v-show="project.achieved">
                            <span class="has-text-link">Achieved</span>:
                            <span
                              class="tag is-info is-rounded is-outlined mr-1 is-medium"
                              v-for="achieve in project.achieved"
                              :key="achieve"
                              >{{ achieve }}</span
                            >
                          </div>
                        </section>
                      </div>
                    </div>
                    <!--                    <div class="is-size-6 mb-2">{{ project.date }}</div>-->
                    <!--                    <div class="is-size-6 mb-2"><u>Description</u>: {{ project.description }}</div>-->
                    <!--                    <div class="is-size-6 mb-2"><u>Responsibilities</u>: {{ project.responsibilities }}</div>-->
                    <!--                    <div>-->
                    <!--                      <u>Used technologies</u>:-->
                    <!--                      <template v-for="tech in project.usedTechnologies" :key="tech">-->
                    <!--                        <span class="tag is-info is-rounded is-outlined mr-1">{{ tech }}</span>-->
                    <!--                      </template>-->
                    <!--                    </div>-->
                  </div>
                </div>
              </template>
            </div>
          </div>
        </template>
      </div>
    </section>
    <section class="section pt-2 is-hidden-print">
      <div class="title has-text-link">Education</div>
      <div class="columns is-multiline">
        <template v-for="institution in education" :key="institution.institutionName">
          <div class="column is-full">
            <div class="title is-size-4">
              <span class="icon"><i :class="institution.icon"></i></span>
              {{ institution.institutionName }}
            </div>
            <div class="subtitle is-size-6">
              {{ institution.dateRange }}
            </div>
            <div class="subtitle is-size-5">
              {{ institution.title }}:
              <span class="is-italic">{{ institution.name }}</span>
            </div>
          </div>
        </template>
      </div>
    </section>
    <section class="section pt-2 is-hidden-print">
      <div class="title has-text-link">Additional Courses</div>
      <div class="columns is-multiline is-mobile">
        <template v-for="platform in courses" :key="platform.name">
          <div class="column is-full-mobile is-full-tablet is-half-desktop" v-if="!platform.simpleList">
            <p class="title is-size-4">{{ platform.name }}</p>
            <div class="columns is-multiline is-mobile">
              <template v-for="course in platform.courses" :key="course.name">
                <div class="column is-half-mobile is-one-quarter-tablet" v-if="course.image || course.proofLink">
                  <p class="subtitle is-size-7 mb-1">
                    {{ course.name }}
                  </p>
                  <a :href="course.proofLink" target="_blank" v-if="course.image">
                    <figure class="image is-rounded is-4by3">
                      <img :src="course.image" />
                    </figure>
                  </a>
                  <a
                    :href="course.proofLink"
                    class="button is-small is-link"
                    target="_blank"
                    v-else
                    v-show="course.proofLink"
                    >Certificate</a
                  >
                </div>
                <div class="column is-full-mobile is-half-tablet" v-else>
                  {{ course.name }}
                </div>
              </template>
            </div>
          </div>
          <div class="column is-full-mobile is-full-tablet is-half-desktop" v-else>
            <p class="title is-size-4 mb-1">{{ platform.name }}</p>
            <div class="content columns is-mobile">
              <ul class="column">
                <li v-for="course in platform.courses" :key="course">{{ course.name }}</li>
              </ul>
            </div>
          </div>
        </template>
      </div>
    </section>
    <!--  End Main version-->
  </div>
  <!--  Print version-->
  <section class="section has-background-white has-text-black is-print-only mt-0 pt-0 pb-1">
    <h1 class="title has-text-centered is-size-4">{{ fullName }}</h1>
    <h2 class="subtitle has-text-centered is-size-5">{{ positionName }} {{ positionLangs }}</h2>
    <div class="columns is-multiline">
      <div class="column is-half">
        <h1 class="title is-size-6 mb-1">Contacts:</h1>
        <template v-for="contact in contacts" :key="contact.name">
          <p class="is-size-6">
            <span class="icon is-small"><i :class="contact.icon"></i></span><u>{{ contact.name }}</u
            >: {{ contact.value }}
          </p>
        </template>
      </div>
      <div class="column is-half">
        <h1 class="title is-size-6 mb-1">Work Type:</h1>
        <template v-for="detail in details" :key="detail.name">
          <p class="is-size-6">
            <span class="icon is-small"><i :class="detail.icon"></i></span><u>{{ detail.name }}</u
            >: {{ detail.value }}
          </p>
        </template>
        <h1 class="title is-size-6 mb-1">Languages:</h1>
        <template v-for="lang in languages" :key="lang.name">
          <p class="is-size-6">
            <u>{{ lang.name }}</u
            >: {{ lang.level }}
          </p>
        </template>
      </div>
    </div>
  </section>
  <section
    class="section has-background-white has-text-black is-print-only mt-0 pt-0 pb-1"
    v-show="printOptions['About Me'].value"
  >
    <div class="content">
      <h1 class="title has-text-centered is-size-4 mb-1">About Me</h1>
      <template v-for="paragraph in paragraphs" :key="paragraph">
        <p class="is-size-6" v-html="paragraph"></p>
      </template>
    </div>
  </section>
  <section
    class="section has-background-white has-text-black is-print-only my-0 pt-0 pb-1"
    v-show="printOptions.Technologies.value"
  >
    <div class="content">
      <h1 class="title has-text-centered is-size-4 mb-3">Technologies</h1>
      <div class="columns is-multiline">
        <template v-for="category in technologies" :key="category.categoryName">
          <div class="column is-half">
            <h1 class="title is-size-5 mb-1">
              <u>{{ category.categoryName }}</u>
            </h1>
            <p class="mb-0" v-for="block in category.blocks" :key="block.blockName">
              <strong class="is-size-6" v-html="block.blockName"></strong>:
              <template v-for="(tag, index) in block.items" :key="tag.name">
                <span class="has-text-black">{{ tag.name }}</span>
                <span v-if="index == block.items.length - 1">.</span>
                <span v-else>, </span>
              </template>
            </p>
          </div>
        </template>
      </div>
    </div>
  </section>
  <section
    class="section has-background-white has-text-black is-print-only my-0 pt-0 pb-1"
    v-show="printOptions.Experience.value"
  >
    <div class="content is-small">
      <h4 class="title has-text-centered is-size-4 mb-0">Experience</h4>
      <template v-for="job in experience" :key="job.heading">
        <h5 class="title is-size-5 mt-4 mb-1">
          {{ job.heading }} <span class="is-size-7">[{{ job.fromDate }} - {{ job.toDate }}]</span>
        </h5>
        <!--        <h6 class="subtitle is-size-7 mb-1">{{ job.fromDate }} - {{ job.toDate }}</h6>-->
        <template v-for="project in job.projects" :key="project.title">
          <h6 class="is-size-6 mb-0">
            <u>Project</u>: {{ project.title }} <span class="is-size-7">[{{ project.date }}]</span>
          </h6>
          <!--          <h6 class="subtitle is-size-7 m-0"><u>Date</u>: {{ project.date }}</h6>-->
          <p class="mb-1"><u>Description</u>: {{ project.description }}</p>
          <!--          <p class="mb-1"><u>Responsibilities</u>: {{ project.responsibilities }}</p>-->
          <!--          <p class="mb-1">-->
          <!--            <u>Used Technologies</u>:-->
          <!--            <template v-for="(tech, i) in project.usedTechnologies" :key="tech">-->
          <!--              {{ tech }}<span v-if="i !== project.usedTechnologies.length - 1">, </span>-->
          <!--              <span v-else>.</span>-->
          <!--            </template>-->
          <!--          </p>-->
        </template>
      </template>
    </div>
  </section>
  <section class="section has-background-white has-text-black is-print-only mt-0 py-0">
    <div class="content" v-show="printOptions.Education.value">
      <h1 class="title has-text-centered is-size-4 mb-3">Education</h1>
      <div class="columns is-multiline">
        <template v-for="institution in education" :key="institution.institutionName">
          <div class="column is-half">
            <h2 class="subtitle is-size-5 mb-1">
              <span class="icon is-small"><i :class="institution.icon"></i></span>
              {{ institution.institutionName }}
            </h2>
            <h6 class="subtitle is-size-6 mb-3">{{ institution.dateRange }}</h6>
            <p class="is-size-6">{{ institution.title }}: {{ institution.name }}</p>
          </div>
        </template>
      </div>
    </div>
    <div class="content" v-show="printOptions['Additional Courses'].value">
      <h1 class="title has-text-centered is-size-4 mb-3">Additional Courses</h1>
      <div class="columns is-multiline">
        <template v-for="platform in courses" :key="platform.name">
          <div class="column is-half">
            <h1 class="subtitle is-size-6 mb-0"><u>Platform</u>: {{ platform.name }}</h1>
            <ul class="mt-1 ml-5">
              <template v-for="course in platform.courses" :key="course.name">
                <li class="mb-0 mt-0">{{ course.name }}</li>
              </template>
            </ul>
          </div>
        </template>
      </div>
    </div>
  </section>
  <!--  End Print version-->
</template>

<script setup>
import {ref, nextTick, onBeforeMount, onMounted} from "vue";
import QrcodeVue from "qrcode.vue";
import contactsJSON from "./assets/data/contacts.json";
import aboutMeJSON from "./assets/data/aboutMe.json";
import aboutMeDetailedJSON from "./assets/data/aboutMeDetailed.json";
import detailsJSON from "./assets/data/details.json";
import languagesJSON from "./assets/data/languages.json";
import technologiesJSON from "./assets/data/technologies.json";
import experienceJSON from "./assets/data/experience.json";
import educationJSON from "./assets/data/education.json";
import coursesJSON from "./assets/data/courses.json";

function closeModalById(id) {
  const element = document.getElementById(id);
  element.classList.remove("is-active");
}

function openModalById(id) {
  const element = document.getElementById(id);
  element.classList.add("is-active");
}

function copy(text) {
  navigator.clipboard.writeText(text).then(
    function () {},
    function (err) {
      console.error("Error copy", err);
    }
  );
}

const setTheme = (theme) => {
  localStorage.setItem("user-theme", theme);
  userTheme.value = theme;
  document.documentElement.className = theme;
};

const getTheme = () => {
  return localStorage.getItem("user-theme");
};

const toggleTheme = () => {
  const activeTheme = localStorage.getItem("user-theme");
  if (activeTheme === "light-theme") {
    setTheme("dark-theme");
  } else {
    setTheme("light-theme");
  }
};

const getMediaPreference = () => {
  const hasDarkPreference = window.matchMedia("(prefers-color-scheme: dark)").matches;
  if (hasDarkPreference) {
    return "dark-theme";
  } else {
    return "light-theme";
  }
};

const userTheme = ref(getTheme() || getMediaPreference());

onMounted(() => setTheme(userTheme.value));

function getTime(timeZone) {
  const options = {
    timeZone,
    timeZoneName: "shortOffset",
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  };
  const formatter = new Intl.DateTimeFormat([], options);
  return formatter.format(new Date());
}
function setTime() {
  tzDateTime.value = getTime("Europe/Kyiv");
}
onBeforeMount(() => {
  setTime();
  tzDateTimeInterval.value = setInterval(setTime, 1000);
});

const tzDateTime = ref(undefined);
const tzDateTimeInterval = ref(undefined);

function changeModal() {
  showPrintModal.value = false;
  showPrintOptionsModal.value = true;
}

function changeModalBack() {
  showPrintOptionsModal.value = false;
  showPrintModal.value = true;
}

function print() {
  showPrintModal.value = false;
  showPrintOptionsModal.value = false;
  nextTick(() => {
    // Access updated DOM
    window.print();
  });
}

const showPrintModal = ref(false);
const showPrintOptionsModal = ref(false);
const readMoreAboutModal = ref(false);
const printOptions = ref({
  Contacts: {value: true, type: "checkbox", is_disabled: true},
  "About Me": {value: false, type: "checkbox"},
  Technologies: {value: true, type: "checkbox"},
  Experience: {value: true, type: "checkbox"},
  Education: {value: false, type: "checkbox"},
  "Additional Courses": {value: false, type: "checkbox"},
});

const cvURL = ref("https://kostiantyn-salnykov.github.io/");
const fullName = ref("Kostiantyn Salnykov");
const positionName = ref("Software Engineer");
const positionLangs = ref("(Python 🐍, Rust 🦀)");
const position = ref("Software Engineer<br>(Python 🐍, Rust 🦀)");
const paragraphs = ref(aboutMeJSON);
const aboutMeMore = ref(aboutMeDetailedJSON);
const contacts = ref(contactsJSON);
const details = ref(detailsJSON);
const languages = ref(languagesJSON);
const technologies = ref(technologiesJSON);
const experience = ref(experienceJSON);
const education = ref(educationJSON);
const courses = ref(coursesJSON);
</script>

<style scoped lang="scss"></style>
