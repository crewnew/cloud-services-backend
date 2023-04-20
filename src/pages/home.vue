<script setup lang="ts">
import { ref } from 'vue'
import { Icon } from '@iconify/vue';
import { useAuth0 } from '@auth0/auth0-vue'

const { logout, loginWithRedirect: userSignIn, user, isAuthenticated } = useAuth0()

function userSignOut() {
  return logout({ logoutParams: { returnTo: window.location.origin } })
}

const fluent_emoji_list = [
"angry-face",
"anguished-face",
"anxious-face-with-sweat",
"astonished-face",
"beaming-face-with-smiling-eyes",
"confounded-face",
"confused-face",
"crying-face",
"disappointed-face",
"dotted-line-face",
"disguised-face",
"downcast-face-with-sweat",
"drooling-face",
"expressionless-face",
"face-blowing-a-kiss",
"face-exhaling",
"face-holding-back-tears",
"face-savoring-food",
"face-screaming-in-fear",
"face-with-diagonal-mouth",
"face-with-hand-over-mouth",
"face-with-monocle",
"face-with-open-eyes-and-hand-over-mouth",
"face-with-open-mouth",
"face-with-peeking-eye",
"face-with-raised-eyebrow",
"face-with-rolling-eyes",
"face-with-spiral-eyes",
"face-with-steam-from-nose",
"face-with-tears-of-joy",
"face-with-tongue",
"face-without-mouth",
"fearful-face",
"flushed-face",
"frowning-face",
"frowning-face-with-open-mouth",
"grimacing-face",
"grinning-face",
"grinning-face-with-smiling-eyes",
"grinning-face-with-sweat",
"grinning-squinting-face",
"hot-face",
"hugging-face",
"hushed-face",
"kissing-face",
"kissing-face-with-closed-eyes",
"kissing-face-with-smiling-eyes",
"knocked-out-face",
"loudly-crying-face",
"lying-face",
"melting-face",
"money-mouth-face",
"nerd-face",
"neutral-face",
"partying-face",
"pensive-face",
"persevering-face",
"pleading-face",
"relieved-face",
"sad-but-relieved-face",
"shushing-face",
"sleeping-face",
"sleepy-face",
"slightly-frowning-face",
"slightly-smiling-face",
"smiling-face",
"smiling-face-with-halo",
"smiling-face-with-hearts",
"smiling-face-with-heart-eyes",
"smiling-face-with-smiling-eyes",
"smiling-face-with-sunglasses",
"smiling-face-with-tear",
"smirking-face",
"sneezing-face",
"squinting-face-with-tongue",
"thinking-face",
"tired-face",
"unamused-face",
"upside-down-face",
"weary-face",
"winking-face",
"winking-face-with-tongue",
"woozy-face",
"worried-face",
"yawning-face",
"zany-face",
"zipper-mouth-face"
]

const emoji_id = ref("thinking-face")

const icon_is_hovered = ref(false)

const changeEmoji = () => {
  if (icon_is_hovered.value) return
  icon_is_hovered.value = true
  emoji_id.value = fluent_emoji_list[Math.floor(Math.random() * fluent_emoji_list.length)]
}
</script>

<template>
  <!-- <Icon icon="fluent-emoji:thinking-face" /> -->
  <div
    class="absolute top-0 bottom-0 left-0 right-0 flex justify-center items-center"
  >
    <h1>please&nbsp;</h1>
    <h1
      v-if="!isAuthenticated"
      class="hover:cursor-pointer"
      @click="userSignIn()"
    >
      login
    </h1>

    <h1 v-else class="hover:cursor-pointer" @click="userSignOut()">logout</h1>
    <h1>&nbsp;first&nbsp;&nbsp;</h1>
    <h1 style="line-height: 0;">
      <Icon
        :icon="'fluent-emoji:' + emoji_id"
        @mouseover="changeEmoji()"
        @mouseleave="icon_is_hovered = false"
      />
    </h1>
  </div>
</template>
