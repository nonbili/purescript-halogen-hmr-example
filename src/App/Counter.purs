module App.Counter where

import Prelude

import Data.Const (Const)
import Data.Maybe (Maybe(..))
import Effect.Class (class MonadEffect)
import Effect.Console as Console
import Halogen as H
import Halogen.HTML as HH
import Halogen.HTML.Events as HE

type Query = Const Void

type Message = Void

data Action
  = Increase
  | Decrease
  | Finalize

type State = { value :: Int }

component :: forall m. MonadEffect m => H.Component HH.HTML Query Unit Void m
component = H.mkComponent
  { initialState: const initialState
  , render
  , eval: H.mkEval $ H.defaultEval
    { handleAction = handleAction
    , finalize = Just Finalize
    }
  }
  where

  initialState :: State
  initialState = { value: 0 }

  render :: State -> H.ComponentHTML Action () m
  render state =
    HH.div_
      [ HH.h3_
          [ HH.text "A counter" ]
      , HH.div_
          [ HH.button
              [ HE.onClick $ Just <<< const Increase ]
              [ HH.text "+" ]
          ]
      , HH.div_
          [ HH.text $ show state.value ]
      , HH.div_
          [ HH.button
              [ HE.onClick $ Just <<< const Decrease ]
              [ HH.text "-" ]
          ]
      ]

handleAction
  :: forall m
   . MonadEffect m
  => Action
  -> H.HalogenM State Action () Void m Unit
handleAction = case _ of
  Increase ->
    H.modify_ (\state -> state { value = state.value + 1 })
  Decrease ->
    H.modify_ (\state -> state { value = state.value - 1 })
  Finalize -> do
    H.liftEffect $ Console.log "finalize"
