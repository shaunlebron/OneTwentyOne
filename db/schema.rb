# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended to check this file into your version control system.

ActiveRecord::Schema.define(:version => 20130310002553) do

  create_table "blocks", :force => true do |t|
    t.integer "x"
    t.integer "y"
    t.integer "color"
    t.string  "room_key", :limit => 7
  end

  create_table "rooms", :force => true do |t|
    t.integer "width"
    t.integer "height"
    t.integer "prominent_hex"
    t.string  "room_key"
  end

  create_table "users", :force => true do |t|
    t.string  "user_key"
    t.string  "room_key"
    t.integer "color"
  end

end
