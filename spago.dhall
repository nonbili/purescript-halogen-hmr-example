{ name = "example"
, dependencies = [ "console", "effect", "halogen", "psci-support", "debug" ]
, packages = ./packages.dhall
, sources = [ "src/**/*.purs" ]
}
