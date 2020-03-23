module App where

import Prelude

import App.Counter as Counter
import Data.Const (Const)
import Data.Maybe (Maybe(..))
import Data.Symbol (SProxy(..))
import Halogen as H
import Halogen.HTML as HH
import Halogen.HTML.Events as HE
import Halogen.HTML.Properties as HP

type Query = Const Void

data Action = InputName String

type State = { name :: String }

type Slot =
  ( counter :: H.Slot Counter.Query Counter.Message Unit
  )

_counter = SProxy :: SProxy "counter"

app :: forall m. H.Component HH.HTML Query Unit Void m
app = H.mkComponent
  { initialState: const initialState
  , render
  , eval: H.mkEval $ H.defaultEval
      { handleAction = handleAction }
  }
  where

  initialState :: State
  initialState = { name: "" }

  render :: State -> H.ComponentHTML Action Slot m
  render state =
    HH.div_
    [ HH.h3_
      [ HH.text "What's your name?" ]
    , HH.input
      [ HP.attr (HH.AttrName "style") "border-color: blue;"
      , HP.value state.name
      , HE.onValueInput $ Just <<< InputName
      ]
    , HH.p_
      [ HH.text $ "Hello, " <> state.name ]
    , HH.h3_
      [ HH.text "App.Counter"]
    , HH.slot _counter unit Counter.component unit $ const Nothing
    ]

  handleAction :: Action -> H.HalogenM State Action Slot Void m Unit
  handleAction = case _ of
    InputName name -> do
      H.modify_ $ _ { name = name }
