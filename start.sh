#!bin/bash
yarn initial
cp front/public/socket/vue-socketio.js front/node_modules/vue-socket.io/dist/
yarn build
cp -rp server/src/keys cp server/dist/src/
cp -rp server/src/modules/auth/templates server/dist/src/modules/auth
cp -rp server/src/modules/student/templates server/dist/src/modules/student
cp -rp server/src/modules/user/templates server/dist/src/modules/user
cp -rp server/src/modules/questionnaire/templates/images server/dist/src/modules/questionnaire/templates
cp -rp server/src/modules/questionnaire/templates/templates server/dist/src/modules/questionnaire/templates
cp server/src/modules/questionnaire/templates/jquery.min.js server/dist/src/modules/questionnaire/templates
cp server/src/modules/questionnaire/templates/test.pdf server/dist/src/modules/questionnaire/templates