class Room < ActiveRecord::Migration
  def change
     create_table :rooms do |t|
      t.integer :width
      t.integer :height
      t.string :prominent_hex, limit: 7
    end
  end

end
