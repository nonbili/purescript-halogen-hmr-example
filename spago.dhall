{ name = "example"
, dependencies = [ "console", "effect", "halogen", "psci-support" ]
, packages = ./packages.dhall
, sources = [ "src/**/*.purs" ]
}
