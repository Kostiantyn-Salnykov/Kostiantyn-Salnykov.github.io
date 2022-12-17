<template>
  <!--  Main site-->
  <section class="section has-background-black has-text-white py-1 is-hidden-print">
    <div class="buttons">
      <button class="button is-small is-responsive is-danger" @click="showPrintModal = true">
        <span class="icon is-small"><i class="fa-solid fa-print"></i></span>
        <span>Print</span>
      </button>
      <button class="button is-small is-responsive is-success" v-if="showPhoto" @click="showPhoto = !showPhoto">
        <span class="icon is-small"><i class="fa-solid fa-qrcode"></i></span>
        <span>QR Code</span>
      </button>
      <button class="button is-small is-responsive is-link" v-else @click="showPhoto = !showPhoto">
        <span class="icon is-small"><i class="fa-solid fa-image"></i></span>
        <span>Photo</span>
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
            <p  class="has-text-justified">
              To be honest, I don't have a desire to work for a company in the 21st century where people still print
              resumes.
            </p>
            <p class="has-text-justified">It's better to open this page via QR Code and read it without using paper for it.</p>
          </div>
          <QrcodeVue :value="cvURL" :size="200" render-as="svg" class="has-text-centered is-align-self-center" />
        </section>
        <footer class="modal-card-foot">
          <button class="button is-success" @click="showPrintModal = false">
            <span class="icon is-small"><i class="fa-solid fa-tree"></i></span>
            <span>Thanks</span>
          </button>
          <button class="button is-danger" @click="changeModal">
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
          <button class="button is-danger" @click="print">
            <span class="icon is-small"><i class="fa-solid fa-print"></i></span>
            <span>Print</span>
          </button>
        </footer>
      </div>
    </div>
    <div class="columns">
      <div class="column has-background-black is-full-mobile" :class="expandPhoto ? 'is-half' : 'is-one-quarter'">
        <div class="card cursor-resize" @click="expandPhoto = !expandPhoto">
          <div class="card-image" v-if="showPhoto">
            <figure class="image is-3by2">
              <img :src="photoUrl" alt="Photo" class="image" />
            </figure>
          </div>
          <div class="card-image" v-else>
            <figure class="image is-flex is-justify-content-center p-2">
              <QrcodeVue
                :value="cvURL"
                :size="expandPhoto ? 400 : 200"
                render-as="svg"
                background="white"
                foreground="black"
                class="has-text-centered"
              />
            </figure>
          </div>
        </div>
        <div class="title has-text-link has-text-centered">{{ fullName }}</div>
        <div class="subtitle has-text-primary has-text-centered" v-html="position"></div>
      </div>
      <div class="column">
        <div class="content">
          <p class="title has-text-link mb-1">About Me</p>
          <template v-for="paragraph in paragraphs" :key="paragraph">
            <p class="has-text-justified" v-html="paragraph"></p>
          </template>
        </div>
      </div>
    </div>
  </section>
  <section class="section has-background-black has-text-white py-1 is-hidden-print">
    <div class="columns is-gapless is-multiline">
      <div class="column is-full-mobile is-one-third-tablet is-one-quarter-desktop">
        <div class="content">
          <p class="title has-text-link mb-1">Contacts</p>
          <template v-for="contact in contacts" :key="contact.name">
            <div class="field">
              <div class="control">
                <div class="buttons pb-0 mb-0">
                  <a
                    :href="contact.type ? `${contact.type}:${contact.value}` : contact.value"
                    class="button is-responsive is-link"
                    target="_blank"
                  >
                    <span class="icon is-small"><i :class="contact.icon"></i></span>
                    <span>{{ contact.name }}</span>
                  </a>
                  <button class="button is-responsive is-link" @click="copy(contact.value)">
                    <span class="icon is-small"><i class="fa-regular fa-copy"></i></span>
                  </button>
                  <button class="button is-responsive is-link" @click="contact.modal = !contact.modal">
                    <span class="icon is-small"><i class="fa-solid fa-qrcode"></i></span>
                  </button>
                </div>
                <div class="modal" :class="{'is-active': contact.modal}">
                  <div class="modal-background" @click="contact.modal = false"></div>
                  <div class="modal-content">
                    <section
                      class="modal-card-body is-flex is-flex-direction-column is-justify-content-center is-align-items-center"
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
      <div class="column is-full-mobile is-one-third-tablet is-one-quarter-desktop">
        <div class="content">
          <p class="title has-text-link mb-1">Details</p>
          <template v-for="detail in details" :key="detail.name">
            <p>{{ detail.name }}: {{ detail.value }}</p>
          </template>
        </div>
      </div>
      <div class="column is-full-mobile is-one-third-tablet is-one-quarter-desktop">
        <div class="content">
          <p class="title has-text-link mb-1">Languages</p>
          <template v-for="lang in languages" :key="lang.name">
            <p>{{ lang.icon }}{{ lang.name }}: {{ lang.level }}</p>
          </template>
        </div>
      </div>
    </div>
  </section>
  <section class="section has-background-black has-text-white py-1 is-hidden-print">
    <div class="title has-text-link mb-1">Technologies</div>
    <div class="columns is-gapless is-multiline is-mobile">
      <template v-for="category in technologies" :key="category.categoryName">
        <div class="column is-full-mobile is-half-tablet is-one-quarter-desktop">
          <div class="title is-size-4 has-text-link mb-0">
            {{ category.categoryName }}
          </div>
          <div class="content">
            <template v-for="block in category.blocks" :key="block.blockName">
              <p v-html="block.blockName + ': '" class="subtitle is-size-6 has-text-white mt-2 mb-0"></p>
              <div class="">
                <template v-for="item in block.items" :key="item.name">
                  <span class="tag is-link is-rounded">{{ item.name }} {{ item.icon }}</span>
                </template>
              </div>
            </template>
          </div>
        </div>
      </template>
    </div>
  </section>
  <section class="section has-background-black has-text-white py-1 is-hidden-print">
    <div class="title has-text-link">Experience</div>
    <div class="columns is-flex is-flex-direction-column">
      <template v-for="exp in experience" :key="exp">
        <div class="column has-background-black">
          <div class="title is-size-4 has-text-link">{{ exp.heading }}</div>
          <div class="subtitle is-6 has-text-white">({{ exp.fromDate }} - {{ exp.toDate }})</div>
          <div class="columns is-flex is-flex-wrap-wrap">
            <template v-for="project in exp.projects" :key="project.title">
              <div class="column is-half is-full-mobile is-vertical has-text-white">
                <div class="tile is-child">
                  <span class="icon-text has-text-link">
                    <span class="icon">
                      <i :class="project.icon"></i>
                    </span>
                    <span class="subtitle is-size-4 is-size-6-mobile has-text-white">{{ project.title }}</span>
                  </span>
                  <div class="is-size-6 mb-2">{{ project.date }}</div>
                  <div class="is-size-6 mb-2"><u>Description</u>: {{ project.description }}</div>
                  <div class="is-size-6 mb-2"><u>Responsibilities</u>: {{ project.responsibilities }}</div>
                  <div>
                    <u>Used technologies</u>:
                    <template v-for="tech in project.usedTechnologies" :key="tech">
                      <span class="tag is-link is-rounded">{{ tech }}</span>
                    </template>
                  </div>
                </div>
              </div>
            </template>
          </div>
        </div>
      </template>
    </div>
  </section>
  <section class="section has-background-black has-text-white py-1 is-hidden-print">
    <div class="title has-text-link">Education</div>
    <div class="columns">
      <template v-for="institution in education" :key="institution.institutionName">
        <div class="column has-background-black">
          <div class="title has-text-white is-size-4">
            <span class="icon"><i :class="institution.icon"></i></span>
            {{ institution.institutionName }}
          </div>
          <div class="subtitle has-text-white is-size-6">
            {{ institution.dateRange }}
          </div>
          <div class="subtitle has-text-white is-size-5">
            {{ institution.title }}:
            <span class="is-italic">{{ institution.name }}</span>
          </div>
        </div>
      </template>
    </div>
  </section>
  <section class="section has-background-black has-text-white py-1 is-hidden-print">
    <div class="title has-text-link">Additional Courses</div>
    <div class="columns is-multiline is-mobile">
      <template v-for="platform in courses" :key="platform.name">
        <div class="column is-full-mobile is-full-tablet is-half-desktop">
          <p class="title is-size-4 has-text-white">{{ platform.name }}</p>
          <div class="columns is-multiline is-mobile">
            <template v-for="course in platform.courses" :key="course.name">
              <div class="column is-half-mobile is-one-quarter-tablet" v-if="course.image || course.proofLink">
                <p class="subtitle is-size-7 mb-1 has-text-white">
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
      </template>
    </div>
  </section>
  <!--  End Main version-->
  <!--  Print version-->
  <section class="section has-background-white has-text-black is-print-only">
    <h1 class="title has-text-centered is-size-4">{{ fullName }}</h1>
    <h2 class="subtitle has-text-centered is-size-5">{{ positionName }} {{ positionLangs }}</h2>
    <div class="columns">
      <div class="column">
        <h1 class="title is-size-6 mb-1">Contacts:</h1>
        <template v-for="contact in contacts" :key="contact.name">
          <p class="is-size-6">
            <span class="icon is-small"><i :class="contact.icon"></i></span><u>{{ contact.name }}</u
            >: {{ contact.value }}
          </p>
        </template>
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
      <div class="column is-one-third">
        <figure class="image is-responsive" v-if="printOptions['QR or Photo?'].value === 'Photo'">
          <img :src="photoUrl" alt="Photo" width="200" />
        </figure>
        <QrcodeVue
          v-else-if="printOptions['QR or Photo?'].value === 'QR'"
          :value="cvURL"
          :size="200"
          render-as="svg"
          background="white"
          foreground="black"
          class="has-text-centered is-align-self-center"
        />
      </div>
    </div>
  </section>
  <section
    class="section has-background-white has-text-black is-print-only mt-0 pt-0"
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
    class="section has-background-white has-text-black is-print-only my-0 py-0"
    v-show="printOptions.Technologies.value"
    :class="{'has-page-break-before': printOptions['About Me'].value}"
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
              <template v-for="tag in block.items" :key="tag.name">
                <span class="tag is-small is-link has-text-black">{{ tag.name }}</span>
              </template>
            </p>
          </div>
        </template>
      </div>
    </div>
  </section>
  <section
    class="section has-background-white has-text-black is-print-only my-0 pt-2"
    v-show="printOptions.Experience.value"
  >
    <div class="content is-small">
      <h4 class="title has-text-centered is-size-4 mb-3">Experience</h4>
      <template v-for="job in experience" :key="job.heading">
        <h5 class="title is-size-5 mt-4">{{ job.heading }}</h5>
        <h6 class="subtitle is-size-7 mb-1">{{ job.fromDate }} - {{ job.toDate }}</h6>
        <template v-for="project in job.projects" :key="project.title">
          <h6 class="subtitle is-size-6 mb-0"><u>Project</u>: {{ project.title }}</h6>
          <h6 class="subtitle is-size-7 m-0"><u>Date</u>: {{ project.date }}</h6>
          <p class="mb-1"><u>Description</u>: {{ project.description }}</p>
          <p class="mb-1"><u>Responsibilities</u>: {{ project.responsibilities }}</p>
          <p class="mb-1">
            <u>Used Technologies</u>:
            <template v-for="(tech, i) in project.usedTechnologies" :key="tech">
              {{ tech }}<span v-if="i !== project.usedTechnologies.length - 1">, </span>
              <span v-else>.</span>
            </template>
          </p>
        </template>
      </template>
    </div>
  </section>
  <section class="section has-background-white has-text-black is-print-only mt-0 pt-2">
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
    <div
      class="content"
      v-show="printOptions['Additional Courses'].value"
      :class="{
        'has-page-break-before':
          printOptions['About Me'].value &&
          printOptions.Technologies.value &&
          printOptions.Experience.value &&
          printOptions.Education.value,
      }"
    >
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
import {ref, nextTick} from "vue";
import QrcodeVue from "qrcode.vue";
import photoUrl from "./assets/photo.jpg";
import contactsJSON from "./assets/data/contacts.json";
import detailsJSON from "./assets/data/details.json";
import languagesJSON from "./assets/data/languages.json";
import technologiesJSON from "./assets/data/technologies.json";
import experienceJSON from "./assets/data/experience.json";
import educationJSON from "./assets/data/education.json";
import coursesJSON from "./assets/data/courses.json";

function copy(text) {
  navigator.clipboard.writeText(text).then(
    function () {},
    function (err) {
      console.error("Error copy", err);
    }
  );
}

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
const printOptions = ref({
  "QR or Photo?": {
    value: "QR",
    type: "radio",
    options: [
      {name: "QR", value: "QR"},
      {name: "Photo", value: "Photo"},
    ],
  },
  Contacts: {value: true, type: "checkbox", is_disabled: true},
  "About Me": {value: true, type: "checkbox"},
  Technologies: {value: true, type: "checkbox"},
  Experience: {value: true, type: "checkbox"},
  Education: {value: true, type: "checkbox"},
  "Additional Courses": {value: true, type: "checkbox"},
});
const showPhoto = ref(true);
const expandPhoto = ref(false);

const cvURL = ref("https://kostiantyn-salnykov.github.io/");
const fullName = ref("Kostiantyn Salnykov");
const positionName = ref("Software Engineer");
const positionLangs = ref("(Python 🐍, Rust 🦀)");
const position = ref("Software Engineer<br>(Python 🐍, Rust 🦀)");
const paragraphs = ref([
  'I started using Python in 2015. The first course I took, was Coursera <i>"Python for everybody"</i> course. This course was my milestone, after which I dedicated myself to programming. Since that time, I have been constantly improving my engineering skills. I learn new technologies, support the concept of self-education, and developing towards a technical expert (aka <i>"Tech lead"</i>) in the web stack.',
  'I first started out by automating work processes using Python. Worked with .csv files (extract, transform and load). Over the entire period of work as a <u class="">Software Engineer</u>, I have performed various tasks related to planning and architect solutions, making <abbr title="Proof of concept">PoC</abbr>, development, refactoring and testing, integration with third-party services, payment systems, paid and open <abbr title="Application programming interfaces">APIs</abbr>.',
  'I also worked on projects related to e-commerce, auto dealers, gaming <abbr title="Platform as a Service">PaaS</abbr>, insurance companies, projects related to invoices and tax systems, scheduling tasks and meetings, virtual machine automation, <abbr title="Internet of Things">IoT</abbr> projects, wrote back-end for the projects related to Data Science. Also support open source projects, and even create personal ones, for example <a href="https://github.com/Kostiantyn-Salnykov/bankid_asyncio" target="_blank">bankid-asyncio</a>.',
]);
const contacts = ref(contactsJSON);
const details = ref(detailsJSON);
const languages = ref(languagesJSON);
const technologies = ref(technologiesJSON);
const experience = ref(experienceJSON);
const education = ref(educationJSON);
const courses = ref(coursesJSON);
</script>

<style scoped></style>
