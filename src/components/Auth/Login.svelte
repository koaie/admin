<script>
  import { login, authenticating, user } from "./store.js";
  import CircularProgress from "@smui/circular-progress";

  import LayoutGrid, { Cell } from "@smui/layout-grid";
  import Textfield from "@smui/textfield";
  import Icon from "@smui/textfield/icon";
  import HelperText from "@smui/textfield/helper-text";
  import Button, { Label } from "@smui/button";

  import Card from "@smui/card";

  let invalid = false;
  let email = "";
  let password = "";
</script>

<div class="login">
  <Card>
    <LayoutGrid>
      <Cell span={6}>
        <Textfield
          type="email"
          bind:invalid
          updateInvalid
          bind:value={email}
          label="Email"
          input$autocomplete="email"
        >
          <Icon class="material-icons" slot="leadingIcon">email</Icon>
          <HelperText validationMsg slot="helper">Invalid email</HelperText>
        </Textfield>
      </Cell>
      <Cell span={6}>
        <Textfield
          type="password"
          bind:invalid
          bind:value={password}
          label="Password"
          input$autocomplete="password"
        >
          <Icon class="material-icons" slot="leadingIcon">password</Icon>
          <HelperText validationMsg slot="helper">Invalid password</HelperText>
        </Textfield>
      </Cell>
      {#if !$authenticating && !$user}
        <Cell span={12}>
          <div class="right">
            <Button
              on:click={() => {
                login(email, password);
              }}
              variant="outlined"
            >
              <Label>Login</Label>
            </Button>
          </div>
        </Cell>
      {:else}
        <CircularProgress style="height: 32px; width: 32px;" indeterminate />
      {/if}
    </LayoutGrid>
  </Card>
</div>

<style lang="scss">
  @import "Login.scss";
</style>
