module Main where

import Prelude

import App (app)
import Effect (Effect)
import Effect.Aff as Aff
import Halogen.Aff as HA
import Halogen.VDom.Driver as Driver

-- In many cases, you don't need to call dispose, the following is good enough.
--
-- main :: Effect Unit
-- main = HA.runHalogenAff do
--   body <- HA.awaitBody
--   Driver.runUI app unit body

main :: Effect (Effect Unit)
main = do
  appFiber <- Aff.launchAff $ do
    body <- HA.awaitBody
    Driver.runUI app unit body

  -- Return the dispose function to be used in HMR reloading.
  pure $ Aff.launchAff_ $ _.dispose =<< Aff.joinFiber appFiber
